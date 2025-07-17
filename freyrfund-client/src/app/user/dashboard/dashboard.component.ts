import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteAccountComponent } from '../delete-account/delete-account/delete-account.component';
import { InvestComponent } from '../invest/invest/invest.component';
import { PortfolioComponent } from '../portfolio/portfolio/portfolio.component';
import { TopUpComponent } from '../top-up/top-up/top-up.component';
import { WithdrawComponent } from '../withdraw/withdraw/withdraw.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DeleteAccountComponent,
    PortfolioComponent,
    TopUpComponent,
    WithdrawComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }
}
 