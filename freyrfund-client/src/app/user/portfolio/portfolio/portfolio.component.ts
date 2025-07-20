import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

export interface TransactionDto {
  amount: number;
  date: string;
  type: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  transactions: TransactionDto[] = [];
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    console.log('UserId que está a ser usado:', userId);
    if (!userId) {
      this.errorMessage = 'Não foi possível determinar o seu ID de utilizador.';
      return;
    }
    this.userService.getPortfolio(userId).subscribe({
      next: (data) => {
        this.transactions = data;
        console.log('Transactions recebidas:', this.transactions);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du portefeuille.';
      }
    });
  }

  getTypeName(type: string): string {
    switch (type) {
      case 'TopUp': return 'Carregamento';
      case 'Investment': return 'Investimento';
      case 'Withdrawal': return 'Levantamento';
      default: return 'Outro';
    }
  }
}