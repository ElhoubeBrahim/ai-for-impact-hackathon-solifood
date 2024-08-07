import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  Layer,
  Map,
  MapOptions,
  icon,
  latLng,
  marker,
  tileLayer,
} from 'leaflet';

type Location = { latitude: number; longitude: number };

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
})
export class MapComponent implements OnInit, OnChanges {
  @Output() locationChange = new EventEmitter<Location>();

  @Input() location: Location | null = null;
  @Input() center: Location = { latitude: 0, longitude: 0 };
  @Input() zoom = 5;
  @Input() readonly = false;

  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
    ],
    zoom: this.zoom,
    center: latLng(this.center.latitude, this.center.longitude),
  };

  layers: Layer[] = [];
  map: Map | null = null;

  ngOnInit(): void {
    this.updateMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] || changes['center'] || changes['zoom']) {
      this.updateMap();
    }
  }

  updateMap(): void {
    if (this.location) {
      this.layers = [this.createMarker(this.location)];
    }

    if (this.map) {
      this.map.setView(
        latLng(this.center.latitude, this.center.longitude),
        this.zoom
      );
    }
  }

  onMapReady(map: Map): void {
    this.map = map;
  }

  onMapClick(event: any): void {
    if (this.readonly) return;

    const { lat, lng } = event.latlng;
    this.locationChange.emit({ latitude: lat, longitude: lng });
    this.layers = [this.createMarker({ latitude: lat, longitude: lng })];
  }

  createMarker(location: Location): Layer {
    return marker([location.latitude, location.longitude], {
      icon: icon({
        iconUrl: '/assets/marker-icon.png',
        iconAnchor: [19, 35],
      }),
    });
  }
}
