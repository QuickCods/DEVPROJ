import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginData } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,                 // ← necessario para standalone component
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // ← método submit() fora do construtor
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error   = null;

    const payload: LoginData = {
      email:    this.form.value.email,
      password: this.form.value.password
    };

    this.auth.login(payload).subscribe({
      next: () => {
             this.loading = false;
             // ler o role do token e redirecionar
             const role = this.auth.getUserRole();
             if (role === 'Admin') {
               this.router.navigate(['/admin']);
             } else {
               this.router.navigate(['/']);
             }
           },
      error: () => {
        this.loading = false;
        this.error   = 'Credenciais inválidas';
      }
    });
  }
}
