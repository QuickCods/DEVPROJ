import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-invest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css'],
})
export class InvestComponent {
  projectId: number = 0;
  amount: number = 0;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  onInvest() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Não foi possível determinar o seu ID de utilizador.';
      return;
    }
    const id = Number(userId);

    if (this.projectId <= 0 || this.amount <= 0) {
      this.errorMessage = 'Insira um projeto e valor válidos.';
      this.successMessage = '';
      return;
    }

    this.userService.invest(id, this.projectId, this.amount).subscribe({
      next: () => {
        this.successMessage = 'Investimento realizado com sucesso!';
        this.errorMessage = '';
        this.projectId = 0;
        this.amount = 0;
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Erro ao investir. Verifique saldo ou projeto.';
      },
    });
  }
}