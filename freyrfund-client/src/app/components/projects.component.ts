import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../services/project.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error = '';

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar projetos: ' + error.message;
        this.loading = false;
        console.error('Erro ao carregar projetos:', error);
      }
    });
  }

  invest(project: Project, amount: number): void {
    if (amount <= 0) {
      alert('O valor deve ser positivo');
      return;
    }

    if (project.funded + amount > project.target) {
      alert('O valor excede o objetivo do projeto');
      return;
    }

    this.projectService.updateFunding(project.id, { amount }).subscribe({
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
