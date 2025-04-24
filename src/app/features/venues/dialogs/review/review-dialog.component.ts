import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { Review } from '@core/models/review.model';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [ NgIf,  CommonModule, MatDialogContent, MatDialogActions, MatDialogModule],
  templateUrl: './review-dialog.component.html'
})
export class ReviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { reviews: Review[] }) {}
}