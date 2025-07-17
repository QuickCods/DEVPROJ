import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { log } from 'console';

export interface UserDto {
  id?: number;
  fullName: string;
  dateOfBirth: string;  // "dd/MM/yyyy"
  nif: string;
  address: string;
  phoneNumber: string;
  email: string;
  role: string;
  password?: string;    // só no create
}

// Para criação/edição (DTO enviado para o backend)
export interface ProjectDto {
  id?: number;
  title: string;
  rate: number;
  term: number;
  target: number;
  description: string;
  risk: RiskLevel;
}

// Para leitura de projetos (GET do backend)
export interface ProjectView extends ProjectDto {
  funded: number;
  fundingPercentage: number;
  remainingAmount: number;
  isFullyFunded: boolean;
  createdAt: string;
  updatedAt: string;
  riskDescription: string;
}
export enum RiskLevel {
  A = 0, // Seguro
  B = 1, // Mais ou menos
  C = 2  // Inseguro
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'https://localhost:7140/api/admin';
  private TOKEN_KEY = 'authToken'; 

  constructor(private http: HttpClient) {}

  exportAll(): Observable<Blob> {
    const token = this.getToken() || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get(`${this.base}/export/all`, {
      headers,
      responseType: 'blob' as 'json' // <- truque necessário para evitar erro TS
    }) as Observable<Blob>; // <- força tipo da resposta
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  

  // USERS
  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.base}/users`);
  }
  createUser(dto: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.base}/users`, dto);
  }
  updateUser(id: number, dto: UserDto): Observable<void> {
    return this.http.put<void>(`${this.base}/users/${id}`, dto);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }

  // PROJECTS
  getProjects(): Observable<ProjectView[]> {
    return this.http.get<ProjectView[]>(`${this.base}/projects`);
  }
  createProject(dto: ProjectDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${this.base}/projects`, dto);
  }
  updateProject(id: number, dto: ProjectDto): Observable<void> {
    return this.http.put<void>(`${this.base}/projects/${id}`, dto);
  }
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/projects/${id}`);
  }
}
