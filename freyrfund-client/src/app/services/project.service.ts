import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: number;
  title: string;
  rate: number;
  term: number;
  target: number;
  funded: number;
  fundingPercentage: number;
  remainingAmount: number;
  isFullyFunded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateFundingRequest {
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:5218/api/projects';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  updateFunding(id: number, request: UpdateFundingRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/funding`, request);
  }
}
