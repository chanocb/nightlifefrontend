import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {HttpService} from '@core/services/http.service';

import { Venue } from '../shared/models/venue.model';
import { environment } from '@env';

@Injectable({providedIn: 'root'})
export class VenueHomeService {
    static readonly END_POINT = environment.REST + '/venues';
    constructor(private readonly httpService: HttpService) {
    }

    create(venue: Venue): Observable<Venue> {
        return this.httpService
            .post(VenueHomeService.END_POINT, venue);
    }
}