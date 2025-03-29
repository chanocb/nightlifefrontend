import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Venue } from '../../../../core/models/venue.model';

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatButton, MatCheckbox, CommonModule, MatDialogContent
  ],
  templateUrl: './venue-edit-dialog.component.html',
  styleUrls: ['../../venues.component.css']
})
export class VenueEditDialogComponent{
  venue: Venue;

  constructor(
    public dialogRef: MatDialogRef<VenueEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { venue: Venue }
  ) {
    this.venue = { ...data.venue }; 
  }

  onSave(): void {
    this.dialogRef.close(this.venue);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
