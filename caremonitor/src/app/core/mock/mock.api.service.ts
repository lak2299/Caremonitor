import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Item } from '../models/user.model';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Remove trailing slashes
    const url = request.url.replace(/\/$/, '');
    const { method, url: requestUrl, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/api/login') && method === 'POST':
          return authenticate();
        case url.endsWith('/api/items') && method === 'GET':
          return getItems();
        default:
          // Pass through any requests not handled above
          return next.handle(request);
      }
    }

    // Mock API route handlers
    function authenticate() {
      const { email, password } = body as LoginRequest;
      
      // Basic validation - in a real app you would have more robust validation
      if (!email || !password) {
        return error('Email and password are required');
      }

      if (password !== 'password') {
        return error('Username or password is incorrect');
      }

      const response: LoginResponse = {
        token: 'fake-jwt-token',
        user: { email }
      };
      
      return ok(response);
    }

    function getItems() {
      // Check if they're authenticated
      if (!isAuthenticated()) {
        return unauthorized();
      }

      const items: Item[] = [
        { id: 1, name: 'Item 1', description: 'Description for item 1' },
        { id: 2, name: 'Item 2', description: 'Description for item 2' },
        { id: 3, name: 'Item 3', description: 'Description for item 3' },
        { id: 4, name: 'Item 4', description: 'Description for item 4' },
        { id: 5, name: 'Item 5', description: 'Description for item 5' }
      ];
      
      return ok(items);
    }

    // Helper functions
    function ok(body: any) {
      return of(new HttpResponse({ status: 200, body }))
        .pipe(delay(500)); // Simulate server delay
    }

    function error(message: string) {
      return throwError(() => ({ error: { message } }))
        .pipe(
          materialize(),
          delay(500),
          dematerialize()
        );
    }

    function unauthorized() {
      return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
        .pipe(
          materialize(),
          delay(500),
          dematerialize()
        );
    }

    function isAuthenticated() {
      return request.headers.get('Authorization')?.includes('fake-jwt-token');
    }
  }
}

export const mockApiProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockApiInterceptor,
  multi: true
};
