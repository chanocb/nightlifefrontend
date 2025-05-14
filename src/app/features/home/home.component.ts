import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { Role } from '../../core/models/role.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MapComponent } from '../map/map.component';
import { Venue } from '../../core/models/venue.model';
import { VenueHomeService } from '../../core/services/venue-home.service';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [ CommonModule, FormsModule, MapComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  user: User = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    role: Role.CLIENT
  };
  roles: Role[] = [Role.OWNER, Role.CLIENT];
  isAuthenticated$: Observable<boolean>;
  venues$!: Observable<Venue[]>;

  constructor(private router: Router, private authService: AuthService, private venueService: VenueHomeService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.venues$ = this.venueService.getVenuesObservable();
    this.venueService.getVenues().subscribe((venues) => {
      console.log('Datos de venues:', venues);
    });
  }

  goToDetails(venueReference: string): void {
    console.log('Navegando a:', `/venues/${venueReference}`);
    this.router.navigate(['/venues', venueReference]);
  }
}
