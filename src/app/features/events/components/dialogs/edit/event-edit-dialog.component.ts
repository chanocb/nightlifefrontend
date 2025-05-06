import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule, formatDate } from '@angular/common';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { Music } from '@core/models/music.model';
import { MatIcon } from '@angular/material/icon';
import { Schedule, DayOfWeek } from '@core/models/schedule.model';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { EventService } from '@core/services/event.service';
import { VenueHomeService } from '@core/services/venue-home.service';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatButton, CommonModule, MatDialogContent,
    MatSelectModule, MatOptionModule, MatDialogActions
  ],
  templateUrl: './event-edit-dialog.component.html'
})
export class EventEditDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe el evento a editar
  ) {
    this.form = this.fb.group({
      name: [data.event.name, Validators.required],
      description: [data.event.description, Validators.required],
      dateTime: [this.convertToLocalTime(data.event.dateTime), Validators.required]
    });
  }

  // Convierte la fecha UTC a la hora local
  private convertToLocalTime(dateTime: string): string {
    const utcDate = new Date(dateTime);
    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16); // Formato compatible con datetime-local
  }

  // Convierte la hora local a UTC antes de guardar
  private convertToUTC(dateTime: string): string {
    const localDate = new Date(dateTime);
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  }

  save(): void {
    if (this.form.valid) {
      const updatedEvent = {
        ...this.data.event,
        ...this.form.value,
        dateTime: this.convertToLocalTime(this.form.value.dateTime) // Convertir a UTC
      };
      this.dialogRef.close(updatedEvent);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  
}