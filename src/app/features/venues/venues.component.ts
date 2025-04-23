import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { Venue } from '../../core/models/venue.model';
import { VenueHomeService } from '../../core/services/venue-home.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { Music } from '@core/models/music.model';
import { FormsModule } from '@angular/forms';
import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-venues',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css'
})
export class VenuesComponent implements OnInit {
  isOwner: boolean = false;
  venues$!: Observable<Venue[]>;
  
  // Filters
  musicTypes = Object.values(Music);
  availableProducts: Product[] = [];

  // Filter states
  selectedMusic: { [key: string]: boolean } = {};
  minRating: number = 0;
  selectedProduct: string = '';
  maxPrice: number = 0;
  isLGTBFriendly: boolean = false;

  constructor(
    private readonly dialog: MatDialog,
    private authService: AuthService,
    private venueService: VenueHomeService,
    private router: Router
  ) {
    // Initialize filter states
    this.musicTypes.forEach(type => this.selectedMusic[type] = false);
  }

  ngOnInit(): void {
    this.isOwner = this.authService.isOwner();
    this.venues$ = this.venueService.getVenuesObservable();
    this.venueService.getVenues().subscribe((venues) => {
      console.log('Venues data:', venues);
      // Get unique products from all venues
      this.availableProducts = this.getUniqueProducts(venues);
    });
  }

  private getUniqueProducts(venues: Venue[]): Product[] {
    const productsMap = new Map<string, Product>();
    venues.forEach(venue => {
      venue.products.forEach(product => {
        if (!productsMap.has(product.name)) {
          productsMap.set(product.name, product);
        }
      });
    });
    return Array.from(productsMap.values());
  }

  goToDetails(reference: string): void {
    console.log('Navigating to:', `/venues/${reference}`);
    this.router.navigate(['/venues', reference]);
  }

  onMusicFilterChange(): void {
    const selectedGenres = new Set<Music>();
    Object.entries(this.selectedMusic).forEach(([genre, isSelected]) => {
      if (isSelected) {
        selectedGenres.add(genre as Music);
      }
    });

    if (selectedGenres.size > 0) {
      this.venueService.filterByMusicGenres(selectedGenres).subscribe();
    } else {
      // If no genres selected, show all venues
      this.venueService.getVenues().subscribe();
    }
  }

  onRatingChange(): void {
    if (this.minRating > 0) {
      this.venueService.filterByRating(this.minRating).subscribe();
    } else {
      this.venueService.getVenues().subscribe();
    }
  }

  onProductFilterChange(): void {
    if (this.selectedProduct && this.maxPrice > 0) {
      this.venueService.filterByProduct(this.selectedProduct, this.maxPrice).subscribe();
    } else {
      this.venueService.getVenues().subscribe();
    }
  }

  onLGTBFriendlyChange(): void {
    this.venueService.filterByLGTBFriendly(this.isLGTBFriendly).subscribe();
  }
}
