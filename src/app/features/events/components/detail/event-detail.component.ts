import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@core/services/event.service';
import { Event } from '@core/models/event.model';
import { AuthService } from '@core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AccessTypeCreateDialogComponent } from 'app/features/accesstypes/dialogs/create/accesstype-creation-dialog.component';
import { AccessType } from '@core/models/access-type.model';
import { FormsModule } from '@angular/forms';
import { AccessTypeService } from '@core/services/accesstype.service';
import { AccessTypeEditDialogComponent } from 'app/features/accesstypes/dialogs/edit/accesstype-edit-dialog.component';
import { ReservationService } from '@core/services/reservation.service';
import { Reservation } from '@core/models/reservation.model';
import { ReservationStatus } from '@core/models/reservationstatus.model';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './event-detail.component.html',
  })
export class EventDetailComponent implements OnInit {
  event: Event | null = null
  isLoading = true;
  error: string | null = null;
  isOwner: boolean = false;
  isClient: boolean = false;
  authService: AuthService;
  accessTypes: Array<AccessType> = [];
  quantitySelected: { accessType: string; quantity: number }[] = [];
  totalTickets: number = 0;
  totalPrice: number = 0;
  venueReference: string;
  eventReference: string = '';
  reservationsCreated : Array<AccessType>= [];
  reservationsFailed : Array<AccessType>= [];
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private accessTypeService: AccessTypeService,
    private reservationService: ReservationService,
    authService: AuthService,
    private dialog: MatDialog
  ) {
    this.authService = authService;
    this.venueReference = this.route.snapshot.paramMap.get('venueReference')!;
    this.eventReference = this.route.snapshot.paramMap.get('eventReference')!;
  }

  ngOnInit(): void {
    if (this.venueReference && this.eventReference) {
      this.loadEvent(this.venueReference, this.eventReference);
    } else {
      this.error = 'No se pudieron obtener los datos del evento.';
    }

    this.isOwner = this.authService.isOwner();
    this.isClient = this.authService.isClient();
  }

  loadEvent(venueReference: string, eventReference: string): void {
    this.eventService.getEventsByVenueReference(venueReference).subscribe({
      next: (events) => {
        this.event = events.find((e: { reference: string; }) => e.reference === eventReference) || null;
        this.accessTypes = this.event?.accessTypes || [];
        this.accessTypes.sort((a, b) => a.title.localeCompare(b.title));
        this.accessTypes.forEach((accessType) => {
          this.quantitySelected.push({ accessType: accessType.reference, quantity: 0 });
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('🔴 Error al cargar el evento:', err);
        this.error = 'Error al cargar los datos del evento.';
        this.isLoading = false;
      }
    });
  }

  addAccessType(): void {
    const dialogRef = this.dialog.open(AccessTypeCreateDialogComponent, {
      width: '400px',
      data: { eventReference: this.event!.reference },
    });
  
    dialogRef.afterClosed().subscribe({
      next: (accessType) => {
        console.error('Creado el acceso', accessType);
        this.loadEvent(this.venueReference, this.eventReference);
      },
      error: (error) => {
        console.error('Error al crear el acceso:', error);
      }
    });
  }
  
  updateTotals(): void {
    this.totalTickets = this.accessTypes.reduce((sum, accessType) => sum + (this.quantitySelected.find((x) => x!.accessType === accessType.reference)!.quantity || 0), 0);
    this.totalPrice = this.accessTypes.reduce((sum, accessType) => sum + (this.quantitySelected.find((x) => x!.accessType === accessType.reference)!.quantity || 0) * accessType.price, 0);
  }

  deleteAccessType(index: number): void {
    this.accessTypeService.deleteAccessType( this.accessTypes[index].reference).subscribe({
      next: () => {
        console.log('Acceso eliminado correctamente');
        this.loadEvent(this.venueReference, this.eventReference);
      },
      error: (error) => {
        console.error('Error al eliminar el acceso:', error);
      }
    });
    this.loadEvent(this.venueReference, this.eventReference);
  
  }

  editAccessType(index: number): void {
    const dialogRef = this.dialog.open(AccessTypeEditDialogComponent, {
      width: '400px',
      data: { accessType: this.accessTypes[index]},
    });
    dialogRef.afterClosed().subscribe({
      next: (accessType) => {
        accessType.reference = this.accessTypes[index].reference;
        this.accessTypeService.updateAccessType(accessType.reference, accessType).subscribe({
          next: () => {
            this.loadEvent(this.venueReference, this.eventReference); 
          },
          error: (error) => {
            console.error('Error al actualizar el evento:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al editar el acceso:', error);
      }
    });
  }

  createReservation(): void {
    if (this.totalTickets === 0) {
      console.error('No hay entradas seleccionadas.');
      return;
    }
    this.quantitySelected.forEach((quantitySelected) => {
      if (quantitySelected.quantity != 0) {
        console.log('Acceso:', quantitySelected.accessType, 'Cantidad:', quantitySelected.quantity);
        const reservationData : Reservation = {
          reference: '',
          accessType: this.accessTypes.find((x) => 
            x.reference == quantitySelected.accessType)!,

          user: this.authService.currentUser!,
          finalPrice: this.totalPrice,
          status: ReservationStatus.PENDING,
          purchasedDate: new Date().toISOString(),
        };
        for(let i = 0; i < quantitySelected.quantity; i++) {
          this.reservationService.createReservation(reservationData).subscribe({
            next: (response) => {
              if(response?.accessType != null){
                this.reservationsCreated.push(reservationData.accessType);
              }else{
                this.reservationsFailed.push(reservationData.accessType);
              }
              console.log('Reserva creada con éxito:', response);
            },
            error: (error) => {
              console.error('Error al crear la reserva:', error);
            }
          });
        }
        
    };
  });
}
}
