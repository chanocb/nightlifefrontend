import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component'; 
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { VenuesComponent } from './features/venues/venues.component';
import { VenueDetailComponent } from './features/venues/venue-detail.component';
import { MyVenuesComponent } from './features/venues/myvenues.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'myvenues', component: MyVenuesComponent },
  { path: 'venues/:reference', component: VenueDetailComponent },
  { path: '', redirectTo:'home', pathMatch: 'full' }
];