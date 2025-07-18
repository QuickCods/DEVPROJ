import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project, PagedResponse, RiskLevel } from '../../services/project.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { response } from 'express';
import { Router, RouterModule } from '@angular/router';
import { MenuComponent } from '@app/menu-component/menu-component.component';
 
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MenuComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  detailsOpen: { [projectId: number]: boolean } = {};
  toggleDetails(projectId: number): void {
    this.detailsOpen[projectId] = !this.detailsOpen[projectId];
  }

  // Função para saber se detalhes estão visíveis
  isDetailsOpen(projectId: number): boolean {
    return !!this.detailsOpen[projectId];
  }
  projects: Project[] = [];
  loading = false;
  error = '';
 
  // Paginação
  currentPage = 1;
  pageSize = 6;
  totalPages = 0;
  totalCount = 0;
  hasNextPage = false;
  hasPreviousPage = false;
 
  // Pesquisa
  searchTerm = '';
  searchTimeout: any;
 
  // Expor Math para uso no template
  Math = Math;


  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.loadProjects();
  }
 
  loadProjects(): void {
    this.loading = true;
    this.error = '';
 
    this.projectService.getProjects({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined
    }).subscribe({
      next: (response) => {
        //this.projects = projects;
        this.projects = response.data;
        this.currentPage = response.page;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalCount = response.totalCount;
        this.hasNextPage = response.hasNextPage;
        this.hasPreviousPage = response.hasPreviousPage;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar projetos: ' + error.message;
        this.loading = false;
        console.error('Erro ao carregar projetos:', error);
      }
    });

  }


  onSearchChange(): void {
    // Debounce para evitar muitas chamadas à API
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
 
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1; // Reset para primeira página
      this.loadProjects();
    }, 500);
  }
 
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProjects();
    }
  }
 
  nextPage(): void {
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }
 
  previousPage(): void {
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }
 
  getRiskDescription(risk: RiskLevel): string {
    return this.projectService.getRiskDescription(risk);
  }
 
  getRiskClass(risk: RiskLevel): string {
    return this.projectService.getRiskClass(risk);
  }
 
  formatCurrency(value: number): string {
    return this.projectService.formatCurrency(value);
  }
 
  calculateTimeRemaining(createdAt: Date, term: number): { months: number; isExpired: boolean } {
    return this.projectService.calculateTimeRemaining(createdAt, term);
  }
 
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
 
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
 
    return pages;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  getProjectImage(project: Project): string {
    const title = project.title.toLowerCase();
    if (title.includes('projeto beatriz')) return 'assets/images/ParqueAlentejanoP1.png';
    if (title.includes('primeiro projeto') || title.includes('wind')) return 'assets/images/DouroP3.png';
    if (title.includes('novo projeto111') || title.includes('biogas')) return 'assets/images/NeuralForgeP2.png';
    return 'assets/images/images.png'; // fallback
  }

  goToTopUp(): void {
    this.router.navigate(['/top-up']);
  }


 
    invest(project: Project, amount: number): void {
      const userId = this.authService.getUserId();

      if (!userId) {
        alert('Não foi possível identificar o utilizador.');
        return;
      }
    
      if (amount == null || amount <= 0) {
        alert('O valor deve ser positivo');
        return;
      }
    
      if (project.funded + amount > project.target) {
        alert('O valor excede o objetivo do projeto');
        return;
      }
    
      this.projectService.invest(project.id, { userId, amount }).subscribe({
        next: () => {
          this.loadProjects(); // Recarrega a lista
          alert('Investimento realizado com sucesso!');
        },
        error: (error) => {
          alert('Erro ao realizar investimento: ' + error.message);
          console.error('Erro ao investir:', error);
        }
      });
    }
}