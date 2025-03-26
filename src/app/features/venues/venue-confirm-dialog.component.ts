import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './venue-confirm-dialog.component.html',
  imports: [MatDialogActions, MatDialogContent],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { venueName: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Devuelve 'true' si el usuario confirma
  }

  onCancel(): void {
    this.dialogRef.close(false); // Devuelve 'false' si el usuario cancela
  }
}
