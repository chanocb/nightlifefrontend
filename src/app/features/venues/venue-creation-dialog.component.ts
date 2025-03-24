import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatDialogClose, MatButton, MatCheckbox, MatError, CommonModule, MatGridList, MatGridTile, MatDialogContent
  ],
  templateUrl: './venue-creation-dialog.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenueCreateDialogComponent {
    venueForm: FormGroup;

    constructor(
      private readonly fb: FormBuilder,
      private readonly dialog: MatDialogRef<VenueCreateDialogComponent>
    ) {
      this.venueForm = this.fb.group({
        name: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        LGTBFriendly: [false],
        instagram: ['']
      });
    }
  
    create(): void {
      if (this.venueForm.valid) {
        this.dialog.close(this.venueForm.value);
      }
    }
}
