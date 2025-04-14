import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Venue } from '../../core/models/venue.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `<div id="map" class="map-wrapper"></div>`,
  styles: [`.map-wrapper { position: relative; width: 100%; height: 600px; }`]
})
export class MapComponent implements OnChanges {
  @Input() venues: Venue[] = [];
  private map: L.Map | undefined;
  private markersLayer = L.layerGroup();

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venues']) {
      console.log('Venues actualizados:', this.venues);
      this.loadMap();
    }
  }

  private loadMap(): void {
    if (!this.map) {
      this.map = L.map('map').setView([40.4168, -3.7038], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.markersLayer.addTo(this.map);
    }

    this.markersLayer.clearLayers();

    const customIcon = L.icon({
      iconUrl: 'https://img.icons8.com/?size=100&id=cu9Sn3Hvn35s&format=png&color=000000',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });

    this.venues.forEach(venue => {
      if (venue.coordinate) {
        const marker = L.marker([venue.coordinate.latitude, venue.coordinate.longitude], { icon: customIcon });
        marker.addTo(this.markersLayer);
        marker.on('click', () => {
          this.router.navigate(['/venues', venue.reference]);
        });
      }
    });
  }
}