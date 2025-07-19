import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { TransactionDto } from '@app/user/portfolio/portfolio/portfolio.component';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

export interface TransactionDto {
  amount: number;
  date: string;
  type: 'TopUp' | 'Withdrawal' | 'Investment';
  projectId?: number | null;
  projectTitle?: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  
  private baseUrl = 'https://localhost:7140/api/User'; // Ajusta se for diferente
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  //  Extrai o email (unique_name) do token
  public getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      return payload.unique_name || null;
    } catch {
      return null;
    }
  }

  /*public getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      return Number(payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
    } catch {
      return null;
    }
  }*/

  getUserTransactions(userId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`https://localhost:7140/api/transactions/user/${userId}`);
  }

  topUp(userId: number, amount: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/topup`, amount);
  }

  withdraw(userId: number, amount: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/withdraw`, amount);
  }

  getUserBalance(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${userId}/balance`);
  }
  

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    window.location.href = '/login'; // ou usar router.navigate
  }

  public getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      return Number(payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
    } catch {
      return null;
    }
  }

  deleteAccount(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`);
  }

  getPortfolio(userId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.baseUrl}/${userId}/portfolio`);
  }

  invest(userId: number, projectId: number, amount: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/invest`, {
      userId,
      projectId,
      amount,
    });
  }
}