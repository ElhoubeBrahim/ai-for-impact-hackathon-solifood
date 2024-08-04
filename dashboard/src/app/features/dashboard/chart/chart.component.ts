import { CommonModule } from '@angular/common';
import {AfterViewInit, Component, Input, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit, AfterViewInit {
  options: any;
  @Input() basket:Number[] = []
  @Input() order:Number[] = []

  ngOnInit(): void {
    initFlowbite();
    this.options = {
      dataLabels: {
        enabled: true,
        style: {
          cssClass: 'text-xs text-white font-medium'
        },
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 16,
          right: 16,
          top: -26
        },
      },
      series: [
        {
          name: "New Baskets",
          data: this.basket,
          color: "#1A56DB",
        },
        {
          name: "New Orders",
          data: this.order,
          color: "#16a34a",
        },
      ],
      chart: {
        height: "100%",
        maxWidth: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      legend: {
        show: true
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      stroke: {
        width: 6,
      },
      xaxis: {
        categories: ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        labels: {
          formatter: function (value:any) {
            return value;
          }
        }
      },
    }
  }

  ngAfterViewInit (): void {    
    if (document.getElementById("charts") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("charts"), this.options);
      chart.render();
    }
  
  }
}
