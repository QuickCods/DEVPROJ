import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
 
export interface Project {
  id: number;
  title: string;
  description: string;  //novo
  rate: number;
  term: number;
  target: number;
  funded: number;
  fundingPercentage: number;
  remainingAmount: number;
  isFullyFunded: boolean;
  risk: RiskLevel;  //novo
  riskDescription: string; //novo
  createdAt: Date;
  updatedAt: Date;

  investmentAmount?: number;
}

export enum RiskLevel {
  A = 0, // Seguro
  B = 1, // Mais ou menos
  C = 2  // Inseguro
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

  /*getAllProjects(): Observable<Project[]> { //novo
    return this.http.get<Project[]>(`${this.apiUrl}?pageSize=1000`);
  }*/
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


    /**
   * Pesquisar projetos por termo
   */
    searchProjects(searchTerm: string, page: number = 1, pageSize: number = 10): Observable<PagedResponse<Project[]>> {
      return this.getProjects({ search: searchTerm, page, pageSize });
    }

    /**
       * Obter projetos por nível de risco
       */
    getProjectsByRisk(riskLevel: RiskLevel, page: number = 1, pageSize: number = 10): Observable<PagedResponse<Project[]>> {
      // Esta funcionalidade pode ser implementada no backend depois
      return this.getProjects({ page, pageSize });
    }

    /**
     * Obter descrição do risco em português
     */
    getRiskDescription(risk: RiskLevel): string {
      switch (risk) {
        case RiskLevel.A:
          return 'Seguro';
        case RiskLevel.B:
          return 'Moderado';
        case RiskLevel.C:
          return 'Inseguro';
        default:
          return 'Desconhecido';
      }
    }

    /**
     * Obter classe CSS para o nível de risco
     */
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

    /**
     * Formatar valor monetário
     */
    formatCurrency(value: number): string {
      return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    }

    /**
     * Calcular tempo restante do projeto (se aplicável)
     */
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