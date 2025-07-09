import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { HttpClient }    from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,          
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RouterOutlet],   // traz o NgIf, NgFor
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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