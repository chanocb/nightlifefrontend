import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '@core/services/event.service';
import { Event } from '@core/models/event.model';
import { MatDialog } from '@angular/material/dialog';
import { EventCreateDialogComponent } from '../dialogs/creation/event-creation-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { EventEditDialogComponent } from '../dialogs/edit/event-edit-dialog.component';

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
    private dialog: MatDialog,
    private router: Router) {}

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

  editEvent(event: any): void {
    const dialogRef = this.dialog.open(EventEditDialogComponent, {
      width: '400px',
      data: { event }
    });
  
    dialogRef.afterClosed().subscribe((updatedEvent) => {
      if (updatedEvent) {
        // Actualiza el evento en la lista
        const index = this.events.findIndex(e => e.reference === updatedEvent.id);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }
        this.eventService.updateEvent(updatedEvent.reference, updatedEvent).subscribe({
          next: () => {
            this.loadEvents(); // Recarga la lista de eventos
          },
          error: (error) => {
            console.error('Error al actualizar el evento:', error);
          }
        });
      }
    });
  }

  navigateToEvent(eventReference: string): void {
    const venueReference = this.route.snapshot.paramMap.get('venueReference');
    //const venueReference = this.venue!.reference; // Obtén el reference del venue
    this.router.navigate(['/myvenues', venueReference, 'event', eventReference]);
  }
}