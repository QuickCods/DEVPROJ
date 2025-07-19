import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuComponent } from '@app/menu-component/menu-component.component';
 
interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}
 
@Component({
  selector: 'app-faq',
  imports: [ NgIf, RouterModule, NgFor, MenuComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  constructor(private router: Router) {}
  faqs: FaqItem[] = [
    {
      question: 'O que é investimento Peer-to-Peer?',
      answer: 'É uma forma de investimento em que você empresta dinheiro diretamente para pessoas ou empresas através de uma plataforma online, recebendo juros em troca, sem a necessidade de um banco intermediário.',
      open: false
    },
    {
      question: 'Como funciona o P2P?',
      answer: 'As plataformas P2P conectam investidores (pessoas que querem emprestar dinheiro) a tomadores (pessoas ou empresas que precisam de crédito), definindo taxas de juros e prazos de pagamento.',
      open: false
    },
    {
      question: 'Quais são os riscos de investir em P2P?',
      answer: 'O principal risco é o inadimplemento do tomador (não pagamento do empréstimo). Também pode haver riscos de liquidez, já que nem sempre é possível resgatar o dinheiro antes do prazo.',
      open: false
    },
    {
      question: 'Quais são os riscos de investir em P2P?',
      answer: 'O principal risco é o inadimplemento do tomador (não pagamento do empréstimo). Também pode haver riscos de liquidez, já que nem sempre é possível resgatar o dinheiro antes do prazo.',
      open: false
    },
    {
      question: 'P2P é legal?',
      answer: 'A tecnologia P2P é legal. O uso pode ser ilegal apenas se for utilizado para distribuir conteúdo protegido por direitos autorais sem permissão.',
      open: false
    },
       {
      question: 'Qual é a rentabilidade média dos investimentos P2P?',
      answer: 'Isso varia por plataforma, perfil de risco e prazos, mas geralmente os retornos são superiores aos oferecidos por investimentos tradicionais de renda fixa.',
      open: false
    }
  ];
 
  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

  
  goHome() {
    this.router.navigate(['/home']);
  }
}