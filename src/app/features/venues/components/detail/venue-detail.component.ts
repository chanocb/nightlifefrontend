import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VenueHomeService } from '../../../../core/services/venue-home.service';
import { Venue } from '../../../../core/models/venue.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm/venue-confirm-dialog.component';
import { MapComponent } from '../../../map/map.component';
import { Review } from '@core/models/review.model';
import { ReviewService } from '@core/services/review.service';
import { Event } from '@core/models/event.model';
import { EventService } from '@core/services/event.service';
import { Schedule } from '@core/models/schedule.model';

@Component({
  selector: 'app-venue-detail',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatCheckboxModule, MatIconModule, CommonModule, MapComponent, FormsModule],
  templateUrl: './venue-detail.component.html',
  styleUrls: ['../../venues.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueDetailComponent implements OnInit {
  venue: Venue | null = null;
  isEditing = false;
  venueForm: FormGroup;
  isOwner = false; // Para verificar si el usuario es un OWNER
  isClient = false;
  error: string | null = null;
  schedules: Schedule[] = [];

  reviewTitle: string = '';
  rating: number = 1;
  reviewOpinion: string = '';
  stars = [1, 2, 3, 4, 5];
  tempRating: number | null = null;

  reviews: Review[] = [];
  authService: AuthService;
  avgRating: number = 0; // Promedio de las reseñas

  events: Event[] = [];

  constructor(
    authService: AuthService,
    private venueService: VenueHomeService,
    private reviewService: ReviewService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.authService = authService;
    // Creamos el formulario con los controles que necesitamos
    this.venueForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      instagram: [''],
      LGTBFriendly: [false]
    });
  }

  ngOnInit(): void {
    
    const reference = this.route.snapshot.paramMap.get('reference');
    if (reference) {
      this.venueService.getVenueByReference(reference).subscribe({
        next: (venue) => {
          this.venue = venue;
          this.loadVenueDataIntoForm(venue);
          this.isOwner = this.authService.isOwner(); // Verificamos si el usuario es un OWNER

          const userEmail = this.authService.getUserEmail();
          this.isOwner = this.authService.isOwner() && venue.user.email === userEmail;
          this.isClient = this.authService.isClient();
          this.cdRef.markForCheck();
          
          // Load schedules
          this.loadSchedules(reference);

          this.reviewService.getReviewsByVenueId(reference).subscribe({
            next: (reviews) => {
              this.reviews = reviews;
              this.cdRef.markForCheck();
              this.updateAverageRating();
            },
            error: (error) => {
              console.error('🔴 Error al cargar las reseñas:', error);
            }
          });
        },
        error: (error) => {
          this.error = 'Error al cargar el venue.';
          console.error('🔴 Error al cargar el venue:', error);
        }
      });

      this.eventService.getEventsByVenueReference(reference).subscribe({
        next: (events) => {
          this.events = events;
          this.cdRef.markForCheck();
        },
        error: (error) => {
          console.error('🔴 Error al cargar los eventos:', error);
        }
      });
    }
  }

  private loadVenueDataIntoForm(venue: Venue): void {
    this.venueForm.patchValue({
      name: venue.name,
      phone: venue.phone,
      instagram: venue.instagram,
      LGTBFriendly: venue.LGTBFriendly
    });
  }

  toggleEditMode(): void {
    if (!this.isOwner) {
      this.error = 'No tienes permiso para editar este venue.'; // Mostrar mensaje de error si no es el Owner
      return; // No permitimos la edición si no es el propietario
    }
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.venue) {
      this.loadVenueDataIntoForm(this.venue);
    }
  }

  saveVenue(): void {
    if (this.venueForm.valid && this.venue !== null) {
      const updatedVenue = { ...this.venue, ...this.venueForm.getRawValue(), LGTBFriendly: !!this.venueForm.value.LGTBFriendly };
      console.log('🔍 Datos enviados al backend:', updatedVenue);
      this.venueService.updateVenue(this.venue.reference, updatedVenue).subscribe({
        next: (venue) => {
          console.log('🟢 Venue actualizado:', this.venue);
          this.venue = venue;
          this.isEditing = false;
          this.cdRef.markForCheck();
        },
        error: (error) => {
          this.error = 'Error al actualizar el venue.';
          console.error('🔴 Error al actualizar el venue:', error);
        }
      });
    }

  }

  deleteVenue() {
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { venueName: this.venue?.name },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.venueService.deleteVenue(this.venue!.reference).subscribe({
          next: () => {
            this.router.navigate(['/venues']); // Redirigir a la lista de venues
          },
          error: (err) => {
            this.error = "Error al eliminar el venue.";
            console.error(err);
          }
        });
      }
    });
  }

  getMusicGenres(venue: Venue): string {
    return venue.musicGenres && venue.musicGenres.length
      ? venue.musicGenres.join(', ')
      : 'No disponible';
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  submitReview(): void {
    if (this.reviewTitle && this.reviewOpinion && this.rating && this.venue) {
      this.authService.getProfile().subscribe({
        next: (user) => {
          const review: Review = {
            title: this.reviewTitle,
            opinion: this.reviewOpinion,
            rating: this.rating,
            user,
            venue: this.venue!
          };
  
          this.reviewService.createReview(review).subscribe({
            next: (response) => {
              console.log('🟢 Reseña guardada correctamente', response);
              // Limpiar los campos después de enviar la reseña
              this.reviewTitle = '';
              this.reviewOpinion = '';
              this.rating = 5;
              this.cdRef.markForCheck();
              this.reviews = [...this.reviews, response];
              //this.reviews.push(response); // Agregar la nueva reseña a la lista
              this.updateAverageRating();
            },
            error: (error) => {
              this.error = 'Error al enviar la reseña.';
              console.error('🔴 Error al enviar la reseña:', error);
            }
          });
        },
        error: (error) => {
          this.error = 'Error al obtener el perfil del usuario.';
          console.error('🔴 Error al obtener perfil:', error);
        }
      });
    }
  }

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / this.reviews.length;
  }

  private updateAverageRating(): void {
    if (this.reviews.length > 0) {
      const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.avgRating = total / this.reviews.length;
    } else {
      this.avgRating = 0;
    }
  }

  deleteReview(reference: string){
    this.reviewService.deleteReview(reference).subscribe({
      next: () => {
        console.log('🟢 Reseña eliminada correctamente');
        this.reviews = this.reviews.filter(review => review.reference !== reference);
        this.updateAverageRating();
        this.cdRef.markForCheck();
      },
      error: (err) => {
        this.error = "Error al eliminar la reseña.";
        console.error(err);
      }
    });

  }

  private loadSchedules(reference: string): void {
    this.venueService.getSchedules(reference).subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('🔴 Error al cargar los horarios:', error);
      }
    });
  }
}
