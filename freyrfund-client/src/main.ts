import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication }            from '@angular/platform-browser';
import { BrowserModule }                  from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch }   from '@angular/common/http';
import { AppComponent }                   from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes.server';



bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, HttpClient),          // traz CommonModule, Document, etc.
    provideHttpClient(withFetch()),               // habilita fetch() no HttpClient
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
