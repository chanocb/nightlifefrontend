import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VenueHomeService } from './venue-home.service';
import { Venue } from '../shared/models/venue.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-venue-detail',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatCheckboxModule, MatIconModule],
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./venues.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueDetailComponent implements OnInit {
  venue: Venue | null = null;
  isEditing = false;
  venueForm: FormGroup;
  isOwner = false; // Para verificar si el usuario es un OWNER
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private venueService: VenueHomeService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
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
          this.cdRef.markForCheck();
        },
        error: (error) => {
          this.error = 'Error al cargar el venue.';
          console.error('🔴 Error al cargar el venue:', error);
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
    if (this.venueForm.valid && this.venue) {
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
   
}
