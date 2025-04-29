import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@core/services/event.service';
import { Event } from '@core/models/event.model';
import { MatDialog } from '@angular/material/dialog';
import { EventCreateDialogComponent } from '../dialogs/creation/event-creation-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [CommonModule, MatIcon],
    templateUrl: './event.component.html',
  })
export class EventsComponent implements OnInit {
  venueReference!: string;
  events: Event[] = [];
  isLoading = true;

  constructor(private route: ActivatedRoute,
    private eventService: EventService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const ref = params.get('venueReference');
        if (ref) {
          this.venueReference = ref;
          this.loadEvents();
        } else {
          // Manejo de error si no hay referencia
          console.error('No se encontró venueReference en la URL');
        }
      });
  }

  loadEvents(): void {
    this.eventService.getEventsByVenueReference(this.venueReference).subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
      },
      error: () => {
        this.events = [];
        this.isLoading = false;
      }
    });
  }

  openCreateEventDialog(): void {
    const dialogRef = this.dialog.open(EventCreateDialogComponent, {
      width: '400px',
      data: { venueReference: this.venueReference }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.loadEvents(); // Recarga la lista de eventos
      }
    });
  }

  deleteEvent(event: any): void {
    this.eventService.deleteEvent(event.reference).subscribe(() => {
      this.events = this.events.filter(e => e.reference !== event.reference);
    });
  }
}