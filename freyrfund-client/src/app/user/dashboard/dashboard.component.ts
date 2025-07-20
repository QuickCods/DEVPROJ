import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteAccountComponent } from '../delete-account/delete-account/delete-account.component';
import { InvestComponent } from '../invest/invest/invest.component';
import { PortfolioComponent } from '../portfolio/portfolio/portfolio.component';
import { TopUpComponent } from '../top-up/top-up/top-up.component';
import { WithdrawComponent } from '../withdraw/withdraw/withdraw.component';
import { Router, RouterModule } from '@angular/router';
import { MenuComponent } from '@app/menu-component/menu-component.component';
import { Project, ProjectService } from '@app/services/project.service';
import { UserService, TransactionDto } from '@app/services/user.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenuComponent,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalProjectsInvested = 0;
  totalAssets = 0;
  averageReturn = 0;
  totalDeposits = 0;
  availableBalance = 0;

  latestTransactions: TransactionDto[] = [];
  selectedFilter: string = 'All';

  showTopUpModal = false;
showWithdrawModal = false;
topUpAmount: number = 0;
withdrawAmount: number = 0;

openTopUpModal() {
  this.showTopUpModal = true;
  this.showWithdrawModal = false;
}

openWithdrawModal() {
  this.showWithdrawModal = true;
  this.showTopUpModal = false;
}

closeModals() {
  this.showTopUpModal = false;
  this.showWithdrawModal = false;
}

submitTopUp() {
  const userId = this.userService.getUserId();
  if (userId && this.topUpAmount > 0) {
    this.userService.topUp(userId, this.topUpAmount).subscribe({
      next: () => {
        this.topUpAmount = 0;
        this.loadUserData(); 
        this.closeModals();
      },
      error: (err) => {
        console.error('Erro ao fazer top-up:', err);
      }
    });
  }
}
private loadUserData(): void {
  const userId = this.userService.getUserId();
  if (!userId) return;

  this.userService.getUserTransactions(userId).subscribe(transactions => {
    this.latestTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const investments = transactions.filter(t => t.type === 'Investment' && t.projectId != null);
    this.totalAssets = Math.abs(investments.reduce((sum, t) => sum + Number(t.amount), 0));

    const deposits = transactions.filter(t => t.type === 'TopUp');
    const withdrawals = transactions.filter(t => t.type === 'Withdrawal');

    const totalDeposited = deposits.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalWithdrawn = withdrawals.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
    const totalInvested = investments.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    this.totalDeposits = totalDeposited;
    this.availableBalance = totalDeposited - totalInvested - totalWithdrawn;

    const investedProjectIds = new Set(investments.map(t => t.projectId));
    this.totalProjectsInvested = investedProjectIds.size;

    this.projectService.getAllProjects().subscribe((res) => {
      const projectRates: number[] = [];
      const projects = res.data;

      investedProjectIds.forEach(id => {
        const project = projects.find((p: Project) => p.id === id);
        if (project) {
          projectRates.push(project.rate);
        }
      });

      this.averageReturn = projectRates.length > 0
        ? projectRates.reduce((sum, r) => sum + r, 0) / projectRates.length
        : 0;
    });
  });
}

submitWithdraw() {
  const userId = this.userService.getUserId();
  if (userId && this.withdrawAmount > 0) {
    this.userService.withdraw(userId, this.withdrawAmount).subscribe({
      next: () => {
        this.withdrawAmount = 0;
        this.loadUserData(); 
        this.closeModals();
      },
      error: (err) => {
        console.error('Erro ao fazer withdraw:', err);
      }
    });
  }
}


  get filteredTransactions(): TransactionDto[] {
    if (this.selectedFilter === 'All') {
      return this.latestTransactions;
    }
    return this.latestTransactions.filter(tx => tx.type === this.selectedFilter);
  }

  setFilter(type: string): void {
    this.selectedFilter = type;
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private projectService: ProjectService
  ) {}

    

  ngOnInit(): void {

    this.loadUserData();

    const userId = this.userService.getUserId();
    if (!userId) return;
  
    this.userService.getUserTransactions(userId).subscribe(transactions => {
      console.log('Transactions:', transactions);

      this.latestTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

        const investments = transactions.filter(t => t.type === 'Investment' && t.projectId != null);
        this.totalAssets = Math.abs(
          investments.reduce((sum, t) => sum + Number(t.amount), 0)
        );
        
        const deposits = transactions.filter(t => t.type === 'TopUp');
        const withdrawals = transactions.filter(t => t.type === 'Withdrawal');

        const totalDeposited = deposits.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalWithdrawn = withdrawals.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
        const totalInvested = investments.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

        this.totalDeposits = totalDeposited;
        this.availableBalance = totalDeposited - totalInvested - totalWithdrawn;
        
        const investedProjectIds = new Set(investments.map(t => t.projectId));
        this.totalProjectsInvested = investedProjectIds.size;
  
        this.projectService.getAllProjects().subscribe((res) => {
          const projectRates: number[] = [];
        
          const projects = res.data; 
        
          investedProjectIds.forEach(id => {
            const project = projects.find((p: Project) => p.id === id);
            if (project) {
              projectRates.push(project.rate);
            }
          });
        
          this.averageReturn = projectRates.length > 0
            ? projectRates.reduce((sum, r) => sum + r, 0) / projectRates.length
            : 0;
        });
        
        
    });
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  goToTopUp(): void {
    this.router.navigate(['/top-up']);
  }
}

