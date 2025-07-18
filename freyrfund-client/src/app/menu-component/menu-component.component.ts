import { NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormularioContactoComponent } from '@app/components/formulario-contacto/formulario-contacto.component';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ NgIf, RouterModule, FormularioContactoComponent   ],
  templateUrl: './menu-component.component.html',
  styleUrls: ['./menu-component.component.css']
})
export class MenuComponent {
  email: string = 'Utilizador';
  menuOpen: boolean = false;
  showContactForm: boolean = false;


  constructor(private router: Router, private userService: UserService) {}
  
  ngOnInit(): void {
    this.email = this.userService.getUserEmail() ?? '';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  }

  goToWithdraw() {
    this.router.navigate(['/withdraw']);
  }

  goToTopUp(): void {
    this.router.navigate(['/top-up']);
  }

  getUserName(email: string): string {
    return email?.split('@')[0] || '';
  }
  openContactForm() {
    this.showContactForm = true;
    this.closeMenu(); // fecha dropdown
  }
  closeContactForm() {
    this.showContactForm = false;
  }
  
  goToFaq(): void {
    this.router.navigate(['/faq']);
  }
  

  logout() {
    // Lógica de logout
    this.userService.logout();
  }

  deleteAccount() {
    const confirmed = confirm('Tens a certeza que queres eliminar a tua conta? Esta ação é irreversível.');
    if (confirmed) {
      const userId = this.userService.getUserId();
      if (userId) {
        this.userService.deleteAccount(userId).subscribe({
          next: () => {
            this.userService.logout();
          },
          error: () => {
            alert('Erro ao eliminar conta.');
          }
        });
      }
    }
  }
  

  // Fecha o menu ao clicar fora
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-right')) {
      this.closeMenu();
    }
  }
}
