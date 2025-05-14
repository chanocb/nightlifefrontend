import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule, formatDate } from '@angular/common';
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
  templateUrl: './event-creation-dialog.component.html'
})
export class EventCreateDialogComponent {
  form: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { venueReference: string },
    private eventService: EventService,
    private venueService: VenueHomeService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      dateTime: ['', Validators.required]
    });
  }

  async create(): Promise<void> {
    if (this.form.invalid) return;

    const eventData = {
      ...this.form.value,
      venueReference: this.data.venueReference
    };
    
    eventData.dateTime = formatDate(eventData.dateTime, 'yyyy-MM-ddTHH:mm', 'en-US') + ":00.000"; 
    eventData.venue = await firstValueFrom(this.venueService.getVenueByReference(this.data.venueReference));

    this.eventService.createEvent(eventData).subscribe(() => {

      this.dialogRef.close('created');
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  
}