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
    importProvidersFrom(BrowserModule, HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    provideRouter(routes),
  ]
}).catch(err => console.error(err));
