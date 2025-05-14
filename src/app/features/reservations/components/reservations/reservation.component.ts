import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '@core/models/reservation.model';
import { ReservationService } from '@core/services/reservation.service';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reservation.component.html',
  })
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  isLoading = true;

  constructor(private route: ActivatedRoute,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    this.reservationService.findByUserEmail(this.authService.currentUser!.email).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.isLoading = false;
       
      },
      error: () => {
        this.reservations = [];
        this.isLoading = false;
      }
    });
  }
}