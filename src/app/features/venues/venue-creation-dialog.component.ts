import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { VenueHomeService } from './venue-home.service';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatDialogClose, MatButton, MatCheckbox, MatError, CommonModule, MatDialogContent
  ],
  templateUrl: './venue-creation-dialog.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenueCreateDialogComponent{
    venueForm: FormGroup;
    user: User | null = null;

    constructor(
      private readonly fb: FormBuilder,
      private readonly dialog: MatDialogRef<VenueCreateDialogComponent>,private readonly venueHomeService: VenueHomeService, private authService: AuthService
    ) {
      this.venueForm = this.fb.group({
        name: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        LGTBFriendly: [false],
        instagram: ['']
      });

      // Obtener el usuario logueado al iniciar el componente
      const userEmail = this.authService.getUserEmail();
      if (userEmail) {
        this.authService.getProfile().subscribe({
          next: (user) => {
            this.user = user; // Almacenar el usuario logueado
          }
          
        });
      } else {
        console.error('Usuario no autenticado');
      }
    }
  
  
    create(): void {
      console.log('Creando el venue...', this.user);
      if (this.venueForm.valid && this.user) {
        const venueData = this.venueForm.value;
        venueData.user = this.user;
        console.log('Datos del venue:', venueData);
        this.venueHomeService.create(venueData).subscribe(() => {
          this.dialog.close();
        });
      }
    }
}
