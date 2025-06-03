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
    styleUrls: ['./validate-reservation.component.css']
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
          const constraints = {
            video: {
              deviceId: this.selectedDevice.deviceId,
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          };
          navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
              const videoElement = document.querySelector('zxing-scanner video') as HTMLVideoElement;
              if (videoElement) {
                videoElement.srcObject = stream;
                videoElement.setAttribute('playsinline', 'true');
                //videoElement.style.transform = 'rotate(180deg)';
              }
            })
            .catch(err => {
              this.message = 'Error accessing camera';
              this.isCameraActive = false;
            });
        }
      })
      .catch(err => {
        this.message = 'Error accessing camera';
        this.isCameraActive = false;
      });
  }

  onCodeResult(result: any) {
    if (!this.isCameraActive) return;

    this.reservationService.validateReservation(result.toString()).subscribe({
      next: (reservation) => {
        this.validReservation = reservation;
        this.message = 'Reservation successfully validated';
        this.isCameraActive = false;
      },
      error: (error) => {
       
         if (error.status === 404) {
          this.message = 'Reservation already validated or not found';
        } else {
          this.message = 'Error validating reservation';
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