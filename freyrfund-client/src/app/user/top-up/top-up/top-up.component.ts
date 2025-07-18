import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.css']
})
export class TopUpComponent {
  amount: number = 0;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onTopUp() {
    const userId = this.authService.getUserId(); // assumindo que existe este método
    if (!userId) {
      this.errorMessage = 'Não foi possível determinar o seu ID de utilizador.';
      return;
    }
    const id = Number(userId);

    this.userService.topUp(id, this.amount).subscribe({
      next: () => {
        this.successMessage = 'Saldo carregado com sucesso!';
        this.errorMessage = '';
        this.amount = 0;

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Erro ao carregar saldo.';
      }
    });
  }
}