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
  imports: [CommonModule, FormsModule],
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
    this.successMessage = '';
    this.errorMessage = '';

    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = "Impossible d'identifier l'utilisateur.";
      return;
    }

    const id = Number(userId);
    const withdrawalAmount = Number(this.amount);

    if (withdrawalAmount <= 0) {
      this.errorMessage = 'Veuillez entrer une valeur valide.';
      return;
    }

    this.userService.getPortfolio(id).subscribe({
      next: (transactions) => {
        const totalTopUp = transactions
          .filter(t => t.type === 'TopUp')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalWithdraw = transactions
          .filter(t => t.type === 'Withdrawal')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalInvestment = transactions
          .filter(t => t.type === 'Investment')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const availableBalance = totalTopUp - totalWithdraw - totalInvestment;

        if (withdrawalAmount > availableBalance + 0.001) {
          this.errorMessage = "Opération impossible : fonds insuffisants.";
          return;
        }

        this.userService.withdraw(id, withdrawalAmount).subscribe({
          next: () => {
            this.successMessage = 'Retrait effectué avec succès !';
            this.amount = 0;
            setTimeout(() => this.router.navigate(['/home']), 1000);
          },
          error: (err) => {
            console.error('Erro ao fazer withdraw:', err);

            if (err.status === 400 && err.error?.title) {
              this.errorMessage = err.error.title;
            } else {
              this.errorMessage = "Erreur lors du retrait.";
            }
          }
        });
      },
      error: () => {
        this.errorMessage = "Erreur lors de la récupération du solde.";
      }
    });
  }
}
