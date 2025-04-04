import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { VenueHomeService } from '../../../../core/services/venue-home.service';
import { Venue } from '../../../../core/models/venue.model';
import {  ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { VenueCreateDialogComponent } from '../../dialogs/creation/venue-creation-dialog.component';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialogs/confirm/venue-confirm-dialog.component';
import { VenueEditDialogComponent } from '../../dialogs/edit/venue-edit-dialog.component';


@Component({
  selector: 'app-myvenues',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatCheckboxModule, MatIconModule, CommonModule],
  templateUrl: './myvenues.component.html',
  styleUrls: ['../../venues.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyVenuesComponent implements OnInit {
  private venuesSubject = new BehaviorSubject<Venue[]>([]);
  venues$ = this.venuesSubject.asObservable();
  isOwner: boolean = false;

  constructor(
    private readonly dialog: MatDialog,
    private authService: AuthService,
    private venueService: VenueHomeService
  ) {
    
  }

  ngOnInit(): void {
    this.isOwner = this.authService.isOwner();
    if (this.isOwner) {
      this.loadVenues();
    } else {
      this.venues$ = of([]);
    }
      
  }
  loadVenues(): void {
    this.venueService.getVenuesByOwner(this.authService.getUserEmail()!).subscribe(venues => {
      this.venuesSubject.next(venues); // Emitir los venues actualizados al BehaviorSubject
    });
  }

  create(): void {
    this.dialog.open(VenueCreateDialogComponent).afterClosed().pipe(
      switchMap(() => this.venueService.getVenuesByOwner(this.authService.getUserEmail()!))
    ).subscribe((venues) => {
      this.venuesSubject.next(venues); // Actualizar la lista de venues después de crear uno
    });
    console.log('Create venue');
  }

  openEditDialog(venue: Venue): void {
    const dialogRef = this.dialog.open(VenueEditDialogComponent, {
      width: '400px',
      data: { venue }
    });

    dialogRef.afterClosed().subscribe(updatedVenue => {
      if (updatedVenue) {
        this.updateVenue(updatedVenue);
      }
    });
  }

  updateVenue(updatedVenue: Venue): void {
    this.venueService.updateVenue(updatedVenue.reference, updatedVenue).subscribe({
      next: () => {
        const updatedVenues = this.venuesSubject.value.map(v =>
          v.reference === updatedVenue.reference ? updatedVenue : v
        );
        this.venuesSubject.next(updatedVenues);
      },
      error: (err) => {
        console.error('Error al actualizar el venue', err);
      }
    });
    console.log('Nuevo Venue', updatedVenue);
  }

  openDeleteDialog(venue: Venue): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { venueName: venue.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteVenue(venue);
      }
    });
  }

  deleteVenue(venue: Venue): void {
    this.venueService.deleteVenue(venue.reference).subscribe({
      next: () => {
        // Filtrar el venue eliminado de la lista y emitir los venues actualizados
        const updatedVenues = this.venuesSubject.value.filter(v => v.reference !== venue.reference);
        this.venuesSubject.next(updatedVenues);
      },
      error: (err) => {
        console.error('Error al eliminar el venue', err);
      }
    });
  }

  getMusicGenres(venue: Venue): string {
    return venue.musicGenres && venue.musicGenres.length
      ? venue.musicGenres.join(', ')
      : 'No disponible';
  }
  
}


