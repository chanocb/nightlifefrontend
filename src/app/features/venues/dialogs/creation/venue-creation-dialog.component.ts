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
import { MatIcon } from '@angular/material/icon';
import { Schedule, DayOfWeek } from '@core/models/schedule.model';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatDialogClose, MatButton, MatCheckbox, MatError, CommonModule, MatDialogContent, MatIcon,
    MatSelectModule, MatOptionModule
  ],
  templateUrl: './venue-creation-dialog.component.html',
  styleUrls: ['../../venues.component.css']
})
export class VenueCreateDialogComponent {
  venueForm: FormGroup;
  user: User | null = null;
  imageUrlPreview: string | undefined;
  musicGenres: string[] = Object.values(Music);
  schedules: FormArray;
  daysOfWeek = Object.values(DayOfWeek);
  

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialogRef<VenueCreateDialogComponent>,
    private readonly venueHomeService: VenueHomeService, 
    private authService: AuthService
  ) {
    this.venueForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      LGTBFriendly: [false],
      instagram: [''],
      musicGenres: this.fb.array([]),
      imageUrl: ['', [Validators.required]],
      drinks: this.fb.array([]),
      coordinate: this.fb.group({
        latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
        longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]]
      }),
      schedules: this.fb.array([])
    });

    this.musicGenres.forEach(() => {
      (this.venueForm.get('musicGenres') as FormArray).push(this.fb.control(false));
    });

    this.schedules = this.venueForm.get('schedules') as FormArray;

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

  get drinks(): FormArray {
    return this.venueForm.get('drinks') as FormArray;
  }

  addDrink() {
    const drinkForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });
    this.drinks.push(drinkForm);
  }
  
  removeDrink(index: number) {
    this.drinks.removeAt(index);
  }

  get musicGenresControls() {
    return (this.venueForm.get('musicGenres') as FormArray).controls as FormControl[];
  }

  get schedulesControls() {
    return (this.venueForm.get('schedules') as FormArray).controls as FormGroup[];
  }

  addSchedule() {
    const scheduleForm = this.fb.group({
      dayOfWeek: [this.daysOfWeek[0], Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
    this.schedules.push(scheduleForm);
  }

  removeSchedule(index: number) {
    this.schedules.removeAt(index);
  }

  onImageUrlChange(url: string): void {
    this.imageUrlPreview = url;
  }

  create(): void {
    if (this.venueForm.valid && this.user) {
      const selectedGenres = this.musicGenres
        .map((genre, index) => {
          return this.musicGenresControls[index].value ? genre : null;
        })
        .filter((genre) => genre !== null);

      const rawDrinks = this.drinks.controls.map(control => control.value);
      const schedules: Schedule[] = this.schedulesControls.map(control => control.value);

      const venueData = {
        ...this.venueForm.value,
        musicGenres: selectedGenres as Music[],
        products: rawDrinks,
        user: this.user
      };

      this.venueHomeService.create(venueData).subscribe((venue) => {
        if (venue && venue.reference && schedules.length > 0) {
          this.venueHomeService.createSchedules(venue.reference, schedules).subscribe(() => {
            this.dialog.close();
          });
        } else {
          this.dialog.close();
        }
      });
    }
  }

  cancel(): void {
    this.dialog.close();
  }
}