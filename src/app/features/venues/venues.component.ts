import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { Venue } from '../shared/models/venue.model';
import { VenueHomeService } from './venue-home.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venues',
  imports: [CommonModule, MatIconModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css'
})
export class VenuesComponent implements OnInit{

  isOwner: boolean = false;

  venues$!: Observable<Venue[]>;

  constructor(private readonly dialog: MatDialog, private authService: AuthService, private venueService: VenueHomeService, private router: Router) {}


  ngOnInit(): void {
    this.isOwner = this.authService.isOwner();
    this.venues$ = this.venueService.getVenuesObservable();
    this.venueService.getVenues().subscribe((venues) => {
      console.log('Datos de venues:', venues);  // Verifica si reference está presente
    });
  }

  goToDetails(reference: string): void {
    console.log('Navegando a:', `/venues/${reference}`);
    this.router.navigate(['/venues', reference]);
  }

  

}
