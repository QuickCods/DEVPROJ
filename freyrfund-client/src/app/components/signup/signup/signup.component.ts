import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, SignupData } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  public datePlaceholder = 'jj/MM/aaaa';
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router       
  ) {
    this.form = this.fb.group({
      fullName:  ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', Validators.required],                             // mantém o campo para validação
      nif:       ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      address:   ['', Validators.required],
      phone:     ['', [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      agree:     [false, Validators.requiredTrue]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error   = null;
  
    // 1) lê o valor raw do input date (yyyy-MM-dd)
    const rawDate: string = this.form.value.birthDate;  
  
    // 2) quebra em ano, mês, dia
    const [year, month, day] = rawDate.split('-');
  
    // 3) monta no formato dd/MM/yyyy (ou dd/MM/yy, se preferires)
    //    aqui usamos 4 dígitos no ano para simplificar
    const formattedDate = `${day}/${month}/${year}`;
  
    // 4) monta o DTO com a data já no formato que o backend aceita
    const dto = {
      fullName:    this.form.value.fullName,
      dateOfBirth: formattedDate,     // agora "25/09/1996"
      nif:         this.form.value.nif,
      address:     this.form.value.address,
      phoneNumber: this.form.value.phone,
      email:       this.form.value.email,
      password:    this.form.value.password
    };
  
    console.log('▶ payload de signup:', dto);
  
    this.auth.signup(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.errors?.DateOfBirth
          ? err.error.errors.DateOfBirth.join(', ')
          : err.error?.message || 'Erro ao criar conta.';
      }
    });
  }
}
