import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {
  successMessage = '';
  errorMessage = '';
  confirming = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  confirmDelete() {
    this.confirming = true;
  }

  cancel() {
    this.confirming = false;
  }

  deleteAccount() { 
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Não foi possível determinar o seu ID de utilizador.';
      return;
    }
    const id = Number(userId);

    this.userService.deleteAccount(id).subscribe({
      next: () => {
        this.successMessage = 'Conta eliminada com sucesso.';
        this.errorMessage = '';
        this.authService.logout(); // <- se tiveres este método
        this.router.navigate(['/login']); // ou outro caminho
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Erro ao eliminar conta.';
      }
    });
  }
}
