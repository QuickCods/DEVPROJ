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
      question: 'Qu’est-ce que l’investissement Peer-to-Peer ?',
      answer: 'C’est une forme d’investissement dans laquelle vous prêtez de l’argent directement à des personnes ou des entreprises via une plateforme en ligne, en recevant des intérêts en retour, sans avoir besoin d’une banque intermédiaire.',
      open: false
    },
    {
      question: 'Comment fonctionne le P2P ?',
      answer: 'Les plateformes P2P mettent en relation des investisseurs (personnes qui souhaitent prêter de l’argent) avec des emprunteurs (personnes ou entreprises ayant besoin de crédit), en définissant les taux d’intérêt et les échéances de remboursement.',
      open: false
    },
    {
      question: 'Quels sont les risques d’investir en P2P ?',
      answer: 'Le principal risque est le défaut de paiement de l’emprunteur. Il peut aussi y avoir des risques de liquidité, car il n’est pas toujours possible de récupérer l’argent avant l’échéance.',
      open: false
    },
    {
      question: 'Quels sont les risques d’investir en P2P ?',
      answer: 'Le principal risque est le défaut de paiement de l’emprunteur. Il peut aussi y avoir des risques de liquidité, car il n’est pas toujours possible de récupérer l’argent avant l’échéance.',
      open: false
    },
    {
      question: 'Le P2P est-il légal ?',
      answer: 'La technologie P2P est légale. Son usage peut être illégal uniquement s’il est utilisé pour distribuer du contenu protégé par des droits d’auteur sans autorisation.',
      open: false
    },
    {
      question: 'Quelle est la rentabilité moyenne des investissements P2P ?',
      answer: 'Cela varie selon la plateforme, le profil de risque et les échéances, mais en général, les rendements sont supérieurs à ceux des investissements traditionnels à revenu fixe.',
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