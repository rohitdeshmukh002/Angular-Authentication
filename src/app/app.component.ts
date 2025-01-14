import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { User } from '../Model/User';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule
    ],
    templateUrl:'./app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    currentUser: User | null = null;

    constructor(private authService: AuthService) {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    // logout() {
    //     this.authService.logout();
    // }

}