import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component'; 
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { VenuesComponent } from './features/venues/venues.component';
import { VenueDetailComponent } from './features/venues/components/detail/venue-detail.component';
import { MyVenuesComponent } from './features/venues/components/myvenues/myvenues.component';
import { EventsComponent } from './features/events/components/events/event.component';
import { EventDetailComponent } from './features/events/components/detail/event-detail.component';
import { MyReservationsComponent } from './features/reservations/components/reservations/reservation.component';
import { ValidatateReservationComponent } from './features/reservations/components/validation/validate-reservation.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'myvenues', component: MyVenuesComponent },
  { path: 'myreservations', component: MyReservationsComponent },
  { path: 'validate', component: ValidatateReservationComponent },
  { path: 'venues/:venueReference', component: VenueDetailComponent },
  { path: 'venues/:venueReference/event/:eventReference', component: EventDetailComponent },
  { path: 'myvenues/:venueReference/events', component: EventsComponent },
  { path: 'myvenues/:venueReference/event/:eventReference', component: EventDetailComponent },
  { path: '**', redirectTo:'home' }
];