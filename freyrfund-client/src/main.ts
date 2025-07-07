import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication }            from '@angular/platform-browser';
import { BrowserModule }                  from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch }   from '@angular/common/http';
import { AppComponent }                   from './app/app.component';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, HttpClient),          // traz CommonModule, Document, etc.
    provideHttpClient(withFetch())               // habilita fetch() no HttpClient
  ]
}).catch(err => console.error(err));
