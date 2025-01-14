import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

    registerForm !: FormGroup;
    loading = false;
    hidePassword = true;
    hideConfirmPassword = true;
    passwordStrength = '';
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.initializeForm();
        this.setupPasswordStrengthObserver();
    }

    private initializeForm(): void {
        this.registerForm = this.fb.group({
            username: ['', [
                Validators.required, 
                Validators.minLength(3),
                Validators.pattern(/^[a-zA-Z0-9_-]*$/)
            ]],
            email: ['', [
                Validators.required, 
                Validators.email,
                Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
            ]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validator: this.passwordMatchValidator
        });
    }

    private setupPasswordStrengthObserver(): void {
        this.registerForm.get('password')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(password => {
                this.passwordStrength = this.calculatePasswordStrength(password);
            });
    }

    private calculatePasswordStrength(password: string): string {
        if (!password) return '';
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    }

    private passwordMatchValidator(g: FormGroup) {
        const password = g.get('password')?.value;
        const confirmPassword = g.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    togglePasswordVisibility(field: 'password' | 'confirm'): void {
        if (field === 'password') {
            this.hidePassword = !this.hidePassword;
        } else {
            this.hideConfirmPassword = !this.hideConfirmPassword;
        }
    }

    async onSubmit(): Promise<void> {
        if (this.registerForm.invalid) {
            this.snackBar.open('Please fill all required fields correctly', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
            return;
        }

        this.loading = true;

        try {
            const userData = {
                username: this.registerForm.value.username.trim(),
                email: this.registerForm.value.email.trim(),
                password: this.registerForm.value.password,
                confirmPassword: this.registerForm.value.confirmPassword,
            };

            await firstValueFrom(this.authService.register(userData));
            
            this.snackBar.open('Registration successful! Please login.', 'Close', { 
                duration: 3000,
                panelClass: ['success-snackbar']
            });
            this.router.navigate(['/login']);
        } catch (error: any) {
            this.snackBar.open(error.message || 'Registration failed', 'Close', { 
                duration: 3000,
                panelClass: ['error-snackbar']
            });
        } finally {
            this.loading = false;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}