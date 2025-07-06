import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';


@Component({
  selector: 'app-root',
  template: `
    <h1>FreyrFund</h1>

  `
})
export class AppComponent implements OnInit {
  msg: string | null = null;
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getTest().subscribe({
      next: resp => this.msg = resp.message,
      error: err => this.msg = 'Não consegui contactar o API'
    });
  }
}
