import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionDto } from '@app/user/portfolio/portfolio/portfolio.component';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'https://localhost:7140/api/User'; // Ajusta se for diferente

  constructor(private http: HttpClient) {}

  topUp(userId: number, amount: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/topup`, amount);
  }

  withdraw(userId: number, amount: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/withdraw`, amount);
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