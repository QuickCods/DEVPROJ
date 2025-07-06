import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TestResponse { message: string; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://localhost:7243'; // ajuste se necessário

  constructor(private http: HttpClient) {}

  getTest(): Observable<TestResponse> {
    return this.http.get<TestResponse>(`${this.baseUrl}/Test`);
  }
}
