import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

interface ChartData {
  date: Date;
  newBaskets: number;
  newReservations: number;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  private data: ChartData[] = [
    { date: new Date('2023-01-01'), newBaskets: 150, newReservations: 64 },
    { date: new Date('2023-02-01'), newBaskets: 141, newReservations: 41 },
    { date: new Date('2023-03-01'), newBaskets: 145, newReservations: 76 },
    { date: new Date('2023-04-01'), newBaskets: 152, newReservations: 41 },
    { date: new Date('2023-05-01'), newBaskets: 135, newReservations: 113 },
    { date: new Date('2023-06-01'), newBaskets: 125, newReservations: 173 },
  ];

  private svg: any;
  private margin = { top: 80, right: 30, bottom: 80, left: 80 };
  private width = 900 - this.margin.left - this.margin.right;
  private height = 600 - this.margin.top - this.margin.bottom;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;

  ngOnInit() {
    this.createChart();
  }

  ngAfterViewInit() {
    this.addAnimations();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;

    // Create SVG with a gradient background
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    const gradient = this.svg.append('defs')
      .append('linearGradient')
      .attr('id', 'bg-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color:#f3e7e9;stop-opacity:1');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color:#e3eeff;stop-opacity:1');

    this.svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('fill', 'url(#bg-gradient)');

    const g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Create scales
    const x0 = d3.scaleBand()
      .domain(this.data.map(d => d.date.toISOString().split('T')[0]))
      .range([0, this.width])
      .padding(0.3);

    const x1 = d3.scaleBand()
      .domain(['newBaskets', 'newReservations'])
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => Math.max(d.newBaskets, d.newReservations)) as number])
      .nice()
      .range([this.height, 0]);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(['newBaskets', 'newReservations'])
      .range(['#1A56DB', '#16a34a']);

    // Add X axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x0).tickFormat(d => new Date(d).toLocaleDateString()))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add Y axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // Add bars
    const barGroups = g.selectAll('.bar-group')
      .data(this.data)
      .enter().append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d: { date: { toISOString: () => string; }; }) => `translate(${x0(d.date.toISOString().split('T')[0])},0)`);

    barGroups.selectAll('.bar')
      .data((d: { [x: string]: any; }) => ['newBaskets', 'newReservations'].map(key => ({key, value: d[key as keyof ChartData]})))
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: { key: string; }) => x1(d.key) as number)
      .attr('y', this.height)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', (d: { key: string; }) => color(d.key) as string)
      .attr('rx', 6)
      .attr('ry', 6)
      .on('mouseover', (event: MouseEvent, d: any) => this.showTooltip(event, d))
      .on('mouseout', () => this.hideTooltip());

    // Add title with custom font
    g.append('text')
      .attr('class', 'chart-title')
      .attr('x', this.width / 2)
      .attr('y', -this.margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('font-family', 'Arial, sans-serif')
      .text('New Baskets vs New Reservations');

    // Add X axis label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', this.width / 2)
      .attr('y', this.height + this.margin.bottom - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-family', 'Arial, sans-serif')
      .text('Date');

    // Add Y axis label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -this.margin.left + 20)
      .attr('x', -this.height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-family', 'Arial, sans-serif')
      .text('Count');

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.width - 150}, -60)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(['newBaskets', 'newReservations'])
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d: any, i: number) => `translate(0, ${i * 25})`);

    legendItems.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', (d: string) => color(d) as string);

    legendItems.append('text')
      .attr('class', 'legend-label')
      .attr('x', 24)
      .attr('y', 12)
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')
      .text((d: string) => d === 'newBaskets' ? 'New Baskets' : 'New Reservations');

    // Create tooltip
    this.tooltip = d3.select(element).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(255, 255, 255, 0.9)')
      .style('border', '1px solid #ddd')
      .style('padding', '10px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-family', 'Arial, sans-serif')
      .style('font-size', '12px')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
  }

  private addAnimations(): void {
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => Math.max(d.newBaskets, d.newReservations)) as number])
      .nice()
      .range([this.height, 0]);

    this.svg.selectAll('.bar')
      .transition()
      .duration(800)
      .delay((d: any, i: number) => i * 100)
      .attr('y', (d: { value: d3.NumberValue; }) => y(d.value))
      .attr('height', (d: { value: d3.NumberValue; }) => this.height - y(d.value))
      .ease(d3.easeCubicOut);
  }

  private showTooltip(event: MouseEvent, d: any): void {
    const formatValue = d3.format(',');
    this.tooltip.transition().duration(200).style('opacity', .9);
    this.tooltip.html(`
      <strong>${d.key === 'newBaskets' ? 'New Baskets' : 'New Reservations'}</strong><br>
      Value: ${formatValue(d.value)}
    `)
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY - 28}px`);
  }

  private hideTooltip(): void {
    this.tooltip.transition().duration(500).style('opacity', 0);
  }
}