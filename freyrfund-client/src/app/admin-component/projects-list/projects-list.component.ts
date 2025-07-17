import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService, ProjectDto, ProjectView } from '../../services/admin.service';
import { error } from 'node:console';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: ProjectView[] = [];
  form: FormGroup;
  editing = false;
  removingId: number | null = null;

  constructor(
    private admin: AdminService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id:             [null],  // Project identifier
      title:          ['', Validators.required],
      rate:           [null, [Validators.required, Validators.min(0)]],
      term:           [null, [Validators.required, Validators.min(1)]],
      target:         [null, [Validators.required, Validators.min(0.01)]],
      description:    ['', Validators.required], // 👈 novo
      risk:           [0]

    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.admin.getProjects().subscribe(list => this.projects = list);
  }

  startCreate(): void {
    this.editing = true;
    this.form.reset({ id: null });
  }

  startEdit(p: ProjectView): void {
    this.editing = true;
    this.form.patchValue(p);   // ← popula também o id
  }

  cancel(): void {
    this.editing = false;
  }

  save(): void {
    this.form.markAllAsTouched();
    console.log('Form value:', this.form.value);
    console.log('Form valid:', this.form.valid);
    if (this.form.invalid) return;

    const dto: ProjectDto = this.form.value;
    if (dto.id != null) {
      // UPDATE
      this.admin.updateProject(dto.id, dto)
        .subscribe({
          next: () => this.onSaved(),
          error: err => {
            console.log('Erro de validação:', err.error.errors);
            alert("Erro ao atualizar projeto");
          }
        });
    } else {
      // CREATE
      this.admin.createProject(dto)
        .subscribe({
          next: () => this.onSaved(),
          error: err => {
            console.log('Erro de validação:', err.error.errors);
            alert("Erro ao criar projeto");
          }
        });
    }
  }

  private onSaved(): void {
    this.editing = false;
    this.load();
  }

  remove(id: number): void {
    if (!confirm('Remover este projeto?')) return;
    this.removingId = id;
    this.admin.deleteProject(id).subscribe({
      next: () => {
        this.removingId = null;
        this.load();
      },
      error: err => {
        this.removingId = null;
        alert('Erro ao remover projeto: ' + err.status);
      }
    });
  }

  downloadExcel(): void {
    this.admin.exportAll().subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FreyrFund_Export_${new Date().toISOString().slice(0, 19)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        console.error("Erro ao exportar:", err);
        alert("Erro ao exportar. Verifica se estás autenticado como Admin.");
      }
    });
  }
  
}
