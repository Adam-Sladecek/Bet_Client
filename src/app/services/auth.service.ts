import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_CONSTANTS } from '../constants/app.constants';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  async isTokenValid(): Promise<boolean> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }
    
    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired) { 
      try {
        await this.refreshToken()
      }
      catch (err: any) { 
        return false;
      }
    }
    return true;
  }

  async isLoggedIn(): Promise<boolean> {
    return this.isTokenValid();
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    const $obs = this.http.post(API_CONSTANTS.BASE_URL + 'token/refresh/', { refresh: refreshToken })
    const response: any = await firstValueFrom($obs);
    localStorage.setItem('access_token', response.access);
  }

  async login(username: string, password: string) {
    const $obs = this.http.post(API_CONSTANTS.BASE_URL + "token/", { username, password });
    return firstValueFrom($obs);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) 
      this.authService.logout();
    
    return isLoggedIn;
  }
}
