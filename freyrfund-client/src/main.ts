// main.ts
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication }              from '@angular/platform-browser';
import { BrowserModule }                    from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent }                     from './app/app.component';
import { provideRouter }                    from '@angular/router';
import { routes }                           from './app/app.routes.server';
import { TokenInterceptor }                 from './app/services/token.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // 1) Registra BrowserModule + HttpClientModule
    importProvidersFrom(BrowserModule, HttpClientModule),

    // 2) Registra o seu interceptor de classe
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },

    // 3) Rotas
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
