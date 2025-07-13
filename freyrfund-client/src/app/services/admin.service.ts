import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface ProjectDto {
  id?: number;
  title: string;
  description: string;
  amountRequired: number;
  returnRate: number;
  durationMonths: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'https://localhost:7140/api/admin';

  constructor(private http: HttpClient) {}

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
  getProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.base}/projects`);
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
