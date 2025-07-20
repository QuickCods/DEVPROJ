import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';


export interface SignupData {
  fullName:    string;
  dateOfBirth: string;
  nif:         string;
  address:     string;
  phoneNumber: string;
  email:       string;
  password:    string;
}

interface DecodedToken {
  sub?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  id?: string;
}

export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token:   string;
    expires: string;
  }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'https://localhost:7140/api/Auth';
  private TOKEN_KEY = 'authToken'; 

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: SignupData): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/signup`, data);
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, data)
    .pipe(tap(res => {
      localStorage.setItem(this.TOKEN_KEY, res.token);
    }));
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string, remember: boolean) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, token);
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  public getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload: any = jwtDecode(token);
      return payload.role
          || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          || null;
    } catch {
      return null;
    }
  }

  public getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payload = jwtDecode<DecodedToken>(token);
  
      if (payload.sub) {
        return Number(payload.sub);
      }
      const wsId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      if (wsId) {
        return Number(wsId);
      }
      if (payload.id) {
        return Number(payload.id);
      }
      return null;
    } catch {
      return null;
    }
  }
}

