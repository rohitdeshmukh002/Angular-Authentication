import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../../Model/User';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule,
           MatSidenav,
           MatButtonModule,
           MatCardModule,
           MatFormFieldModule,
           MatInputModule,
           MatProgressSpinnerModule,
           MatIconModule,
           MatDividerModule,
           MatSidenav,
           MatSidenav,
           MatSidenavContainer,
           MatSidenavContent,
           MatMenuModule,
           MatListModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
 

  toggleSidenav() {
    this.sidenav.toggle();
  }

  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
