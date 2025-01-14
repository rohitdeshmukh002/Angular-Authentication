import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
 
  }

  login(email: string, password: string, rememberMe: any): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        const user = users[0];
        if (user && user.password === password) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }
        throw new Error('Invalid email or password');
      })
    );
  }


  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }
  
  register(userData: User): Observable<User> {
    // debugger
    // return this.checkEmailExists(userData.email).pipe(
    //   switchMap(exists => {
    //     if (exists) {
    //       return throwError(() => new Error('Email already registered'));
    //     }
        
    //     const { confirmPassword, ...userToSave } = userData as any;
    //     return this.http.post<User>(this.apiUrl, userToSave).pipe(
    //       catchError(error => {
    //         console.error('Registration error:', error);
    //         return throwError(() => new Error('Registration failed. Please try again.'));
    //       })
    //     );
    //   })
    // );
    return this.http.post<User>(this.apiUrl, userData)
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }


  
  forgotPassword(email: string): Observable<any> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      switchMap(users => {
        if (users.length === 0) {
          return throwError(() => new Error('No account found with this email'));
        }

        // Generate temporary password or reset token
        const temporaryPassword = Math.random().toString(36).slice(-8);
        const user = users[0];
        
        // Update user with temporary password
        return this.http.patch(`${this.apiUrl}/${user.id}`, {
          password: temporaryPassword
        }).pipe(
          map(() => {
            // In a real application, you would send an email here
            console.log(`Temporary password for ${email}: ${temporaryPassword}`);
            return { message: 'Password reset instructions sent' };
          })
        );
      }),
      catchError(error => {
        console.error('Password reset error:', error);
        return throwError(() => new Error('Failed to process password reset'));
      })
    );
  }


  googleLogin(): Observable<any> {
    // Implement Google login logic
    return new Observable();
  }

  facebookLogin(): Observable<any> {
    // Implement Facebook login logic
    return new Observable();
  }

  // login(email: string, password: string, rememberMe: boolean = false): Observable<any> {
  //   // Update existing login logic to handle rememberMe
  //   return new Observable();
  // }

}

