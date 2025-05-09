import { Injectable } from "@angular/core";
import { environment } from "@env";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/internal/Observable";
import { Event } from "@core/models/event.model";
import { tap } from "rxjs";
import { AccessType } from "@core/models/access-type.model";

@Injectable({
    providedIn: 'root',
  })
  export class EventService {
    static readonly END_POINT = environment.REST + '/events';
  
    constructor(private readonly httpService: HttpService) {}

    createEvent(event: Event): Observable<Event> {
        return this.httpService.post(EventService.END_POINT, event).pipe(
            tap(() => this.getEventsByVenueReference(event.venue.reference).subscribe()) // Refresca la lista después de crear
          );
      }

    getEventsByVenueReference(venueReference: string) {
      return this.httpService.get(`${EventService.END_POINT}/venue/${venueReference}`);
    }

    deleteEvent(eventReference: string): Observable<void> {
        return this.httpService.delete(`${EventService.END_POINT}/${eventReference}`);
      }

      updateEvent(eventReference: string, event: Event): Observable<void> {
        return this.httpService.put(`${EventService.END_POINT}/${eventReference}`, event);
      }

      getAccessTypesByEventReference(eventReference: string): Observable<AccessType[]> {
        return this.httpService.get(`${EventService.END_POINT}/${eventReference}/access-types`);
      }

      getEventByReference(eventReference: string): Observable<Event> {
        return this.httpService.get(`${EventService.END_POINT}/${eventReference}`);
      }
  }