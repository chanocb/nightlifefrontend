import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { VenueHomeService } from '../../../../core/services/venue-home.service';
import { Venue } from '../../../../core/models/venue.model';
import {  ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VenueCreateDialogComponent } from '../../dialogs/creation/venue-creation-dialog.component';
import { BehaviorSubject, of, switchMap, forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialogs/confirm/venue-confirm-dialog.component';
import { VenueEditDialogComponent } from '../../dialogs/edit/venue-edit-dialog.component';
import { ReviewDialogComponent } from '../../dialogs/review/review-dialog.component';
import { Review } from '@core/models/review.model';
import { ReviewService } from '@core/services/review.service';
import { Router } from '@angular/router';
import { Schedule } from '@core/models/schedule.model';

@Component({
  selector: 'app-myvenues',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatCheckboxModule, MatIconModule, CommonModule, MatDialogModule],
  templateUrl: './myvenues.component.html',
  styleUrls: ['../../venues.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyVenuesComponent implements OnInit {
  private venuesSubject = new BehaviorSubject<Venue[]>([]);
  venues$ = this.venuesSubject.asObservable();
  isOwner: boolean = false;
  venueSchedules: { [key: string]: Schedule[] } = {};

  constructor(
    private readonly dialog: MatDialog,
    private authService: AuthService,
    private venueService: VenueHomeService,
    private reviewService: ReviewService,
    private router: Router
  ) {
    this.venueSchedules = {};
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
    this.venueService.getVenuesByOwner(this.authService.getUserEmail()!).pipe(
      switchMap(venues => {
        this.venuesSubject.next(venues);
        const scheduleRequests = venues.map(venue => 
          this.venueService.getSchedules(venue.reference).pipe(
            switchMap(schedules => {
              this.venueSchedules[venue.reference] = schedules;
              return of(schedules);
            })
          )
        );
        return forkJoin(scheduleRequests);
      })
    ).subscribe({
      next: () => {
        this.venuesSubject.next([...this.venuesSubject.value]);
      },
      error: (error) => {
        console.error('Error al cargar los venues o sus horarios:', error);
      }
    });
  }

  create(): void {
    this.dialog.open(VenueCreateDialogComponent).afterClosed().pipe(
      switchMap(() => this.venueService.getVenuesByOwner(this.authService.getUserEmail()!))
    ).subscribe((venues) => {
      this.venuesSubject.next(venues);
    });
    console.log('Create venue');
  }

  openEditDialog(venue: Venue): void {
    const dialogRef = this.dialog.open(VenueEditDialogComponent, {
      width: '400px',
      data: { venue }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateVenue(result.venue);
        
        if (result.schedules) {
          this.venueService.createSchedules(venue.reference, result.schedules).subscribe({
            next: () => {
              this.venueSchedules[venue.reference] = result.schedules;
              this.venuesSubject.next([...this.venuesSubject.value]);
            },
            error: (error) => {
              console.error('Error al actualizar los horarios:', error);
            }
          });
        }
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
      error: (error) => {
        console.error('Error al actualizar el venue:', error);
      }
    });
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
        const updatedVenues = this.venuesSubject.value.filter(v => v.reference !== venue.reference);
        this.venuesSubject.next(updatedVenues);
        delete this.venueSchedules[venue.reference];
      },
      error: (error) => {
        console.error('Error al eliminar el venue:', error);
      }
    });
  }

  getMusicGenres(venue: Venue): string {
    return venue.musicGenres && venue.musicGenres.length
      ? venue.musicGenres.join(', ')
      : 'No disponible';
  }

  openReviewsDialog(venueReference: string): void {
    this.reviewService.getReviewsByVenueId(venueReference).subscribe({
      next: (reviews: Review[]) => {
        this.dialog.open(ReviewDialogComponent, {
          width: '400px',
          data: { reviews }
        });
      },
      error: (error) => {
        console.error('Error al cargar las reseñas:', error);
      }
    });
  }

  openEventsDialog(venueReference: string): void {
    this.router.navigate([`/myvenues/${venueReference}/events`]);
  }

  openScheduleDialog(venue: Venue): void {
    console.log('Opening schedule dialog for venue:', venue.reference);
  }
}


