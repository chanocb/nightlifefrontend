import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';

import {HttpService} from '@core/services/http.service';

import { Venue } from '../models/venue.model';
import { environment } from '@env';
import { Music } from '../models/music.model';

@Injectable({providedIn: 'root'})
export class VenueHomeService {
    static readonly END_POINT = environment.REST + '/venues';
    private _venues$: BehaviorSubject<Venue[]> = new BehaviorSubject<Venue[]>([]);
    constructor(private readonly httpService: HttpService) {
    }

    create(venue: Venue): Observable<Venue> {
        return this.httpService
            .post(VenueHomeService.END_POINT, venue).pipe(
                tap(() => this.getVenues().subscribe()) // Refresca la lista después de crear
              );
    }

    getVenuesObservable(): Observable<Venue[]> {
        return this._venues$.asObservable();
      }
    
      getVenues(): Observable<Venue[]> {
        return this.httpService.get(VenueHomeService.END_POINT).pipe(
          tap(data => this._venues$.next(data))
        );
      }

      getVenueByReference(reference: string): Observable<Venue> {
        return this.httpService.get(VenueHomeService.END_POINT+`/${reference}`);
      }

      getVenuesByOwner(email: string): Observable<Venue[]> {
        return this.httpService.get(VenueHomeService.END_POINT+`/owner?email=${email}`);
      }

      updateVenue(reference: string, venue: Venue): Observable<Venue> {
        return this.httpService.put(VenueHomeService.END_POINT+`/${reference}`, venue);
      }

      deleteVenue(reference: string): Observable<void> {
        return this.httpService.delete(VenueHomeService.END_POINT+`/${reference}`);
      }

      filterByMusicGenres(musicGenres: Set<Music>): Observable<Venue[]> {
        const params = Array.from(musicGenres).map(genre => `musicGenres=${genre}`).join('&');
        return this.httpService.get(`${VenueHomeService.END_POINT}/filter/music-genres?${params}`).pipe(
          tap(data => this._venues$.next(data))
        );
      }

      filterByRating(minRating: number): Observable<Venue[]> {
        return this.httpService.get(`${VenueHomeService.END_POINT}/filter/rating/${minRating}`).pipe(
          tap(data => this._venues$.next(data))
        );
      }

      filterByProduct(productName: string, maxPrice: number): Observable<Venue[]> {
        return this.httpService.get(`${VenueHomeService.END_POINT}/filter/product?productName=${productName}&maxPrice=${maxPrice}`).pipe(
          tap(data => this._venues$.next(data))
        );
      }

      filterByLGTBFriendly(isLGTBFriendly: boolean): Observable<Venue[]> {
        return this.httpService.get(`${VenueHomeService.END_POINT}/filter/lgtb-friendly/${isLGTBFriendly}`).pipe(
          tap(data => this._venues$.next(data))
        );
      }

      /**
       * Crea los horarios para un venue específico
       * @param reference Referencia del venue
       * @param schedules Array de horarios
       */
      createSchedules(reference: string, schedules: import('../models/schedule.model').Schedule[]): Observable<Venue> {
        return this.httpService.post(`${VenueHomeService.END_POINT}/${reference}/schedules`, schedules);
      }

      getSchedules(reference: string): Observable<import('../models/schedule.model').Schedule[]> {
        return this.httpService.get(`${VenueHomeService.END_POINT}/${reference}/schedules`);
      }

      getSchedule(reference: string, scheduleId: string): Observable<import('../models/schedule.model').Schedule> {
        return this.httpService.get(`${VenueHomeService.END_POINT}/${reference}/schedules/${scheduleId}`);
      }
}