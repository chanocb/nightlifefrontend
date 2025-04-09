import { Component, Inject } from '@angular/core';
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

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatButton, MatCheckbox, CommonModule, MatDialogContent, MatIconModule
  ],
  templateUrl: './venue-edit-dialog.component.html',
  styleUrls: ['../../venues.component.css']
})
export class VenueEditDialogComponent{
  venue: Venue;
  musicGenres = Object.values(Music);
  musicGenresControls: FormArray<FormControl>;

  constructor(
    public dialogRef: MatDialogRef<VenueEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { venue: Venue }
  ) {
    this.venue = { ...data.venue }; 

    this.musicGenresControls = new FormArray<FormControl>(
      this.musicGenres.map(genre => new FormControl(this.venue.musicGenres?.includes(genre) || false))
    );
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

    this.dialogRef.close(this.venue);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
