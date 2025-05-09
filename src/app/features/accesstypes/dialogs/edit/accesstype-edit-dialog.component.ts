import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AccessType } from '@core/models/access-type.model';

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatButton, MatError, CommonModule, MatDialogContent,
    MatSelectModule, MatOptionModule
  ],
  templateUrl: './accesstype-edit-dialog.component.html'
})
export class AccessTypeEditDialogComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccessTypeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accessType: AccessType }
  ) {

    this.form = this.fb.group({
      title: [data.accessType.title || '', Validators.required],
      capacityMax: [data.accessType.capacityMax || 0, [Validators.required, Validators.min(1)]],
      price: [ 0, [Validators.required, Validators.min(0)]],
      limitHourMax: ['', Validators.required],
      numDrinks: [ 0, [Validators.required, Validators.min(0)]]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}