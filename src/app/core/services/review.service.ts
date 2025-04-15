import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { Review } from '@core/models/review.model';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  static readonly END_POINT = environment.REST + '/reviews';
  private _reviews$: BehaviorSubject<Review[]> = new BehaviorSubject<Review[]>([]);

  constructor(private readonly httpService: HttpService) {}

  // Crear una nueva reseña
  createReview(review: Review): Observable<Review> {
    return this.httpService.post(ReviewService.END_POINT, review).pipe(
      tap(() => this.getReviewsByVenueId(review.venue.reference).subscribe()) // Refresca la lista después de crear
    );
  }

  // Obtener todas las reseñas
  getReviewsObservable(): Observable<Review[]> {
    return this._reviews$.asObservable();
  }

  // Obtener todas las reseñas de todos los venues
  getReviews(): Observable<Review[]> {
    return this.httpService.get(ReviewService.END_POINT).pipe(
      tap((data) => this._reviews$.next(data))
    );
  }

  getReviewsByVenueId(venueId: string): Observable<Review[]> {
    return this.httpService.get(ReviewService.END_POINT+`/venue/${venueId}`);
  }

}
