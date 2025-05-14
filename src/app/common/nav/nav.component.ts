import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, CommonModule,MatIconModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent{ 

  isAuthenticated$: Observable<boolean>;
  isOwner$: Observable<boolean>;

  constructor(
    private router: Router,private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isOwner$ = this.isAuthenticated$.pipe(
      map((authenticated: any) => authenticated && this.authService.isOwner())
    );
  }
  
  logout(): void {
    this.authService.logout();
  }

  goToReservations(): void {
    this.router.navigate(['/myreservations']);
  }
  goToValidate(): void {
    this.router.navigate(['/validate']);
  }
 
}
