import { Injectable } from "@angular/core";
import { environment } from "@env";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/internal/Observable";
import { Event } from "@core/models/event.model";
import { tap } from "rxjs";
import { AccessType } from "@core/models/access-type.model";
import { Reservation } from "@core/models/reservation.model";

@Injectable({
    providedIn: 'root',
  })
  export class ReservationService {
    static readonly END_POINT = environment.REST + '/reservations';
  
    constructor(private readonly httpService: HttpService) {}

    createReservation(reservation: Reservation): Observable<Reservation | null>  {
        return this.httpService.post(ReservationService.END_POINT, reservation);
      }

      findAll(): Observable<Array<Reservation>> {
        return this.httpService.get(ReservationService.END_POINT);
      }

      findByUserEmail(email: string): Observable<Array<Reservation>> {
        return this.httpService.get(`${ReservationService.END_POINT}/${email}`);
      }

      validateReservation(qrCode: string): Observable<Reservation> {
        return this.httpService.get(`${ReservationService.END_POINT}/validate/${qrCode}`);
      }

      
    

      
  }