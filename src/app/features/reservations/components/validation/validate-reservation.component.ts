import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '@core/models/reservation.model';
import { ReservationService } from '@core/services/reservation.service';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [CommonModule, ZXingScannerModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './validate-reservation.component.html',
})
export class ValidatateReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  isLoading = true;
  selectedDevice: MediaDeviceInfo | undefined;
  BarcodeFormat = BarcodeFormat;
  validReservation!: Reservation | undefined;
  isCameraActive = true;
  message: string | null = null;

  constructor(private route: ActivatedRoute,
    private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.initializeCamera();
  }

  private initializeCamera() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
          this.selectedDevice = videoDevices[0];
        }
      })
      .catch(err => {
        this.message = 'Error al acceder a la cámara';
        this.isCameraActive = false;
      });
  }

  onCodeResult(result: string) {
    if (!this.isCameraActive) return;

    this.reservationService.validateReservation(result).subscribe({
      next: (reservation) => {
        this.validReservation = reservation;
        this.message = 'Reserva validada correctamente';
        this.isCameraActive = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.message = 'Reserva no encontrada';
        } else if (error.error?.message === 'Reservation already validated') {
          this.message = 'Esta reserva no es válida para hoy o ya ha sido utilizada';
        } else {
          this.message = 'Error al validar la reserva';
        }
        this.validReservation = undefined;
        this.isCameraActive = false;
      }
    });
  }

  restartScanning() {
    this.validReservation = undefined;
    this.message = null;
    this.isCameraActive = true;
    this.initializeCamera();
  }
}