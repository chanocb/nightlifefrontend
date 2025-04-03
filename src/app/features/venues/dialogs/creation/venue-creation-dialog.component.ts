import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { VenueHomeService } from '../../../../core/services/venue-home.service';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { Music } from '@core/models/music.model';

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatDialogClose, MatButton, MatCheckbox, MatError, CommonModule, MatDialogContent
  ],
  templateUrl: './venue-creation-dialog.component.html',
  styleUrls: ['../../venues.component.css']
})
export class VenueCreateDialogComponent {
  venueForm: FormGroup;
  user: User | null = null;
  imageUrlPreview: string | undefined;
  musicGenres: string[] = Object.values(Music)
  

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialogRef<VenueCreateDialogComponent>,
    private readonly venueHomeService: VenueHomeService, 
    private authService: AuthService
  ) {
    this.venueForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      LGTBFriendly: [false],
      instagram: [''],
      musicGenres: this.fb.array([]),
      imageUrl: ['', [Validators.required]]
    });

    this.musicGenres.forEach(() => {
      (this.venueForm.get('musicGenres') as FormArray).push(this.fb.control(false));  // Usamos `push` para agregar controles
    });

    

    const userEmail = this.authService.getUserEmail();
    if (userEmail) {
      this.authService.getProfile().subscribe({
        next: (user) => {
          this.user = user;
        }
      });
    } else {
      console.error('Usuario no autenticado');
    }
  }

  get musicGenresControls() {
    return (this.venueForm.get('musicGenres') as FormArray).controls as FormControl[];
  }
  

  onImageUrlChange(url: string): void {
    this.imageUrlPreview = url;
  }

  create(): void {
    if (this.venueForm.valid && this.user) {
      const selectedGenres = this.musicGenres
      .map((genre, index) => {
        return this.musicGenresControls[index].value ? genre : null;  // Usar el índice correctamente
      })
      .filter((genre) => genre !== null);  // Filtrar los valores nulos

    const venueData = {
      ...this.venueForm.value,
      musicGenres: selectedGenres as Music[],  // Los géneros seleccionados
      user: this.user
    };
      this.venueHomeService.create(venueData).subscribe(() => {
        this.dialog.close();
      });
    }
  }
}