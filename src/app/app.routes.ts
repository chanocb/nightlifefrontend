import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component'; 
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo:'home', pathMatch: 'full' }
];