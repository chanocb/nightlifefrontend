import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Venue } from '../../../../core/models/venue.model';
import { Music } from '@core/models/music.model';
import { MatIconModule } from '@angular/material/icon';
import { Schedule, DayOfWeek } from '@core/models/schedule.model';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { VenueHomeService } from '@core/services/venue-home.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-venue-edit-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatDialogActions,
    MatDialogTitle,
    MatInput,
    MatButton,
    MatCheckbox,
    CommonModule,
    MatIconModule,
    MatSelectModule,
    MatTimepickerModule,
    MatTooltipModule
  ],
  templateUrl: './venue-edit-dialog.component.html',
  styleUrls: ['../../venues.component.css']
})
export class VenueEditDialogComponent {
  venue: Venue;
  musicGenres = Object.values(Music);
  musicGenresControls: FormArray<FormControl>;
  schedules: Schedule[] = [];
  daysOfWeek = Object.values(DayOfWeek);

  constructor(
    public dialogRef: MatDialogRef<VenueEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { venue: Venue },
    private venueService: VenueHomeService
  ) {
    this.venue = { ...data.venue }; 

    this.musicGenresControls = new FormArray<FormControl>(
      this.musicGenres.map(genre => new FormControl(this.venue.musicGenres?.includes(genre) || false))
    );

    // Cargar horarios existentes
    this.venueService.getSchedules(this.venue.reference).subscribe({
      next: (schedules) => {
        this.schedules = schedules;
      },
      error: (error) => {
        console.error('Error al cargar los horarios:', error);
      }
    });
  }

  addSchedule(): void {
    const newSchedule: Schedule = {
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '09:00',
      endTime: '17:00'
    };
    this.schedules.push(newSchedule);
  }

  removeSchedule(index: number): void {
    this.schedules.splice(index, 1);
  }

  addProduct(): void {
    const newProduct = { name: '', price: 0 }; 
    this.venue.products.push(newProduct);
  }

  removeProduct(index: number) {
    this.venue.products.splice(index, 1);
  }

  validatePrice(index: number): void {
    if (this.venue.products[index].price < 0) {
      this.venue.products[index].price = 0;
    }
  }

  onSave(): void {
    this.venue.products = this.venue.products.filter(product => product.name.trim() !== '');
    this.venue.musicGenres = this.musicGenresControls.controls
      .map((control, index) => control.value ? this.musicGenres[index] : null)
      .filter((genre) => genre !== null) as Music[];

    this.dialogRef.close({
      venue: this.venue,
      schedules: this.schedules
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}