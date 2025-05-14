import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { Reservation } from '@core/models/reservation.model';
import { ReservationService } from '@core/services/reservation.service';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [CommonModule, MatIcon, ZXingScannerModule],
    templateUrl: './validate-reservation.component.html',
  })
export class ValidatateReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  isLoading = true;
  selectedDevice: MediaDeviceInfo | undefined;
  BarcodeFormat = BarcodeFormat;
  validReservation!: Reservation | undefined; // Propiedad para almacenar la reserva válida

  constructor(private route: ActivatedRoute,
    private reservationService: ReservationService) {}

  ngOnInit(): void {
   
  }

  onCodeResult(result: string) {
    console.log('QR leído:', result);
    // Aquí puedes validar el QR con tu backend o extraer info
    this.reservationService.validateReservation(result).subscribe({
      next: (reservation) => {
        console.log('Reserva válida:', reservation);
        this.validReservation = reservation;
       
      },
      error: () => {
        console.log('Reserva no válida');
        this.validReservation = undefined;
      }
    });
  }
}