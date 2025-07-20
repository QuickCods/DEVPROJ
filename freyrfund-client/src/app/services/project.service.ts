import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
 
export interface Project {
  id: number;
  title: string;
  description: string;  
  rate: number;
  term: number;
  target: number;
  funded: number;
  fundingPercentage: number;
  remainingAmount: number;
  isFullyFunded: boolean;
  risk: RiskLevel;  
  riskDescription: string; 
  createdAt: Date;
  updatedAt: Date;

  investmentAmount?: number;
}

export enum RiskLevel {
  A = 0, 
  B = 1, 
  C = 2  
}

export interface PagedResponse<T> {
  data: T;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
 
export interface ProjectSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
 
export interface UpdateFundingRequest {
  amount: number;
}
 
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7140/api/projects'; //5218
 
  constructor(private http: HttpClient) { }

   
  getProjects(params?: ProjectSearchParams): Observable<PagedResponse<Project[]>> {
    let httpParams = new HttpParams();
 
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
 
    if (params?.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
 
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PagedResponse<Project[]>>(this.apiUrl,{params: httpParams });
  }

  getAllProjects(): Observable<{ data: Project[] }> {
    return this.http.get<{ data: Project[] }>('https://localhost:7140/api/projects');
  }
  
  getProject(id: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/${id}`);
  }
 
  updateFunding(id: number, request: UpdateFundingRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/funding`, request);
  }

  invest(projectId: number, request: { userId: number; amount: number }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/invest`, request);
  }

    searchProjects(searchTerm: string, page: number = 1, pageSize: number = 10): Observable<PagedResponse<Project[]>> {
      return this.getProjects({ search: searchTerm, page, pageSize });
    }

    getProjectsByRisk(riskLevel: RiskLevel, page: number = 1, pageSize: number = 10): Observable<PagedResponse<Project[]>> {

      return this.getProjects({ page, pageSize });
    }

    getRiskDescription(risk: RiskLevel): string {
      switch (risk) {
        case RiskLevel.A:
          return 'A'; //Seguro
        case RiskLevel.B:
          return 'B'; //Moderado
        case RiskLevel.C:
          return 'C'; //Inseguro
        default:
          return 'Desconhecido';
      }
    }

    getRiskClass(risk: RiskLevel): string {
      switch (risk) {
        case RiskLevel.A:
          return 'risk-safe';
        case RiskLevel.B:
          return 'risk-medium';
        case RiskLevel.C:
          return 'risk-high';
        default:
          return 'risk-unknown';
      }
    }

    formatCurrency(value: number): string {
      return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    }

    calculateTimeRemaining(createdAt: Date, term: number): { months: number; isExpired: boolean } {
      const created = new Date(createdAt);
      const now = new Date();
      const monthsPassed = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
      const remainingMonths = term - monthsPassed;

      return {
        months: Math.max(0, remainingMonths),
        isExpired: remainingMonths <= 0
      };
    }

}