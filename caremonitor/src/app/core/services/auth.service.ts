import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.checkAuth();
  }

  get currentUser() {
    return this.currentUserSignal;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return new Observable<LoginResponse>((observer)=>{
             this.cookieService.set('auth_token', '2sadasda', 1); // Expires in 1 day
             this.currentUserSignal.set({'email' : 'sdasd@gmail.com'});

             observer.next({
                token: 'fake-jwt-token',
                user: { email : 'test@gmail.com'}
              })
    })
    // this.http.post<LoginResponse>('/api/login', credentials)
    //   .pipe(
    //     tap(response => {
    //       this.cookieService.set('auth_token', response.token, 1); // Expires in 1 day
    //       this.currentUserSignal.set(response.user);
    //     })
    //   );
  }

  logout(): void {
    this.cookieService.delete('auth_token');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.cookieService.check('auth_token');
  }

  getToken(): string {
    return this.cookieService.get('auth_token');
  }

  private checkAuth(): void {
    if (this.isAuthenticated()) {
      // In a real app, you might want to validate the token with the server
      // For now, we'll just set a basic user object based on the presence of a token
      this.currentUserSignal.set({ email: 'user@example.com' });
    }
  }
}
