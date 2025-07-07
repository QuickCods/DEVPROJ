import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { CommonModule }  from '@angular/common';
import { HttpClient }    from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,          
  imports: [CommonModule],   // traz o NgIf, NgFor
  template: `
    <h1>FreyrFund</h1>
    <p *ngIf="msg">{{ msg }}</p>
  `
})

export class AppComponent implements OnInit {
  msg?: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ message: string }>(
      'https://localhost:7140/Test'    //'http://localhost:5218/Test' 
    )    
      .subscribe({
        next: resp => {
          console.log('Resposta da API:', resp);
          this.msg = resp.message;
        },
        error:  ()   => this.msg = 'Erro ao chamar a API'
      });
  }
}