import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  transactions: any[] = [];
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Não foi possível determinar o seu ID de utilizador.';
      return;
    }
    const id = Number(userId);

    this.userService.getPortfolio(id).subscribe({
      next: (data) => {
        this.transactions = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar portefólio.';
      }
    });
  }

  getTypeName(type: number): string {
    switch (type) {
      case 0: return 'Carregamento';
      case 1: return 'Investimento';
      case 2: return 'Levantamento';
      default: return 'Outro';
    }
  }
}