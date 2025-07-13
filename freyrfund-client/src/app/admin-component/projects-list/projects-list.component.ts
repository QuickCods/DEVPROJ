import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService, ProjectDto } from '../../services/admin.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './projects-list.component.html',
})
export class ProjectsListComponent implements OnInit {
  projects: ProjectDto[] = [];
  form: FormGroup;
  editing = false;
  removingId: number | null = null;

  constructor(
    private admin: AdminService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id:             [null],                                       // ← control para o id
      title:          ['', Validators.required],
      description:    ['', Validators.required],
      amountRequired: [null, [Validators.required, Validators.min(0.01)]],
      returnRate:     [null, [Validators.required, Validators.min(0)]],
      durationMonths: [null, [Validators.required, Validators.min(1)]]
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

  startEdit(p: ProjectDto): void {
    this.editing = true;
    this.form.patchValue(p);   // ← popula também o id
  }

  cancel(): void {
    this.editing = false;
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const dto: ProjectDto = this.form.value;
    if (dto.id != null) {
      // UPDATE
      this.admin.updateProject(dto.id, dto)
           .subscribe(() => this.onSaved());
    } else {
      // CREATE
      this.admin.createProject(dto)
           .subscribe(() => this.onSaved());
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
}
