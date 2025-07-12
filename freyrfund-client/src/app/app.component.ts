import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS }    from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TokenInterceptor } from './services/token.interceptor';


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
    
  }
}