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
  styleUrls: ['./app.component.css'] // Note que é plural: styleUrls
  //styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {
  msg?: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTheme();
  }
  private loadTheme(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }
}