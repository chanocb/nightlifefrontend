import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import {  NgIf, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule,Validators,FormGroup, ReactiveFormsModule   } from '@angular/forms';
import { AuthService } from "@core/services/auth.service";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, FormsModule, DatePipe, ReactiveFormsModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit{
  user: User | null = null;
  error: string | null = null;
  isEditing: boolean = false;
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      birthDate: [''],
      role: [{ value: '', disabled: true }], 
    });
  }

  ngOnInit(): void {
    console.log('Llamando a getProfile()');

    this.authService.getProfile().subscribe({
      next: (user) => {
        console.log('🟢 Perfil recibido:', user);
        this.user = user;
        this.loadUserDataIntoForm(user); 
        this.cdRef.markForCheck(); 
      },
      error: (error) => {
        this.error = 'Error al cargar el perfil.';
        console.error('🔴 Error en getProfile:', error);
      },
    });
  }

  
  private loadUserDataIntoForm(user: User): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '', 
      role: user.role,
    });
  }

 
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.loadUserDataIntoForm(this.user); 
    }
  }

  
  saveProfile(): void {
    console.log('🟢 Cambiar perfil:');
    if (this.profileForm.valid && this.user) {
      const updatedUser: User = {
        ...this.user,
        ...this.profileForm.getRawValue(), 
      };

      this.authService.updateProfile(updatedUser).subscribe({
        next: (user) => {
          console.log('🟢 Perfil actualizado:', user);
          this.user = user;
          this.isEditing = false; 
          this.cdRef.markForCheck(); 
        },
        error: (error) => {
          this.error = 'Error al actualizar el perfil.';
          console.error('🔴 Error en updateProfile:', error);
        },
      });
    }
  }

  
}
