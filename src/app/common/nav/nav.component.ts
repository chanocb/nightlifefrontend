import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, CommonModule,MatIconModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent{ 

  isAuthenticated$: Observable<boolean>;

  constructor(
    private router: Router,private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }
  
  logout(): void {
    this.authService.logout();
  }
 
}
