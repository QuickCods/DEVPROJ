import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }     from '@angular/common';
import { AdminService, UserDto } from '../../services/admin.service';
import { RouterModule }     from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: UserDto[] = [];
  form: FormGroup;
  editing = false;

  constructor(
    private admin: AdminService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id:           [null],
      fullName:     ['', Validators.required],
      dateOfBirth:  ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]],
      nif:          ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      address:      ['', Validators.required],
      phoneNumber:  ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      role:         ['', Validators.required],
      password:     ['']   // só para criação
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.admin.getUsers().subscribe(list => this.users = list);
  }

  startCreate(): void {
    this.editing = true;
    this.form.reset({ role: 'User', id: null });
  }

  startEdit(u: UserDto): void {
    this.editing = true;
    // popula TODOS os campos (inclusive o id) para edição
    this.form.patchValue(u);
    // não pede senha na edição
    this.form.get('password')!.clearValidators();
    this.form.get('password')!.updateValueAndValidity();
  }

  cancel(): void {
    this.editing = false;
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const dto: UserDto = this.form.value;
    if (dto.id != null) {
      // UPDATE
      this.admin.updateUser(dto.id, dto)
        .subscribe(() => this.onSaved());
    } else {
      // CREATE
      this.admin.createUser(dto)
        .subscribe(() => this.onSaved());
    }
  }

  private onSaved(): void {
    this.editing = false;
    this.load();
  }

  remove(id: number): void {
    if (!confirm('Confirma remoção?')) return;
    this.admin.deleteUser(id).subscribe(() => this.load());
  }
}
