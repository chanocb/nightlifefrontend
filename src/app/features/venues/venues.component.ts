import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { VenueCreateDialogComponent } from './venue-creation-dialog.component';

@Component({
  selector: 'app-venues',
  imports: [CommonModule, MatIconModule],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css'
})
export class VenuesComponent implements OnInit{

  isOwner: boolean = false;

  constructor(private readonly dialog: MatDialog, private authService: AuthService) {}


  ngOnInit(): void {
    this.isOwner = this.authService.isOwner();
  }

  create(): void {
    this.dialog.open(VenueCreateDialogComponent).afterClosed();
    console.log('Create venue');
  }

}
