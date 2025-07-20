import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MenuComponent } from '@app/menu-component/menu-component.component';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent {
  amount: number = 0;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onWithdraw() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Não foi possível determinar o seu ID de utilizador.';
      return;
    }
    const id = Number(userId);

    if (this.amount <= 0) {
      this.successMessage = '';
      this.errorMessage = 'Entrez une valeur valide.';
      return;
    }

    this.userService.withdraw(id, this.amount).subscribe({
      next: () => {
        this.successMessage = 'Retrait effectué avec succès!';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000); 
        this.errorMessage = '';
        this.amount = 0;
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Erro ao efetuar levantamento.';
      }
    });
  }
}