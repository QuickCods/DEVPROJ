import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TestResponse { message: string; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:7243'; 

  constructor(private http: HttpClient) {}

  getTest(): Observable<TestResponse> {
    return this.http.get<TestResponse>(`${this.baseUrl}/Test`);
  }
}
