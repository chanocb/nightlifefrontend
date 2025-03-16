import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { Role } from '../../core/models/role.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [ RouterLink, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent { 
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

  constructor(private router: Router,private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

}
