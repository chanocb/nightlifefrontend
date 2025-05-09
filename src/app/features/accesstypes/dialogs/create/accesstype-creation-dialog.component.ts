import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AccessTypeService } from '@core/services/accesstype.service';
import { EventService } from '@core/services/event.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatDialogTitle, MatInput, MatDialogClose, MatButton, CommonModule, MatDialogContent,
    MatSelectModule, MatOptionModule
  ],
  templateUrl: './accesstype-creation-dialog.component.html'
})
export class AccessTypeCreateDialogComponent {
  form!: FormGroup;
  eventService: EventService;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccessTypeCreateDialogComponent>,
    private accessTypeService: AccessTypeService,
    eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public data: { eventReference: string }
  ) {
    this.eventService = eventService;
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      title: [ '', Validators.required],
      capacityMax: [ 1, [Validators.required, Validators.min(1)]],
      price: [ 0, [Validators.required, Validators.min(0)]],
      limitHourMax: ['', Validators.required],
      numDrinks: [ 0, [Validators.required, Validators.min(0)]]
    });
  }

  async create(): Promise<void> {
    const eventReference = this.route.snapshot.paramMap.get('eventReference');
    const accessTypeData = {
      ...this.form.value
    };

    accessTypeData.event = await firstValueFrom(this.eventService.getEventByReference(this.data.eventReference))
    if (this.form.valid ) {
      this.accessTypeService.createAccessType(accessTypeData).subscribe((accessType) => {
        if (accessType) {
            this.dialogRef.close();
        } else {
          this.dialogRef.close();
        }
      });      
    }
  }
}