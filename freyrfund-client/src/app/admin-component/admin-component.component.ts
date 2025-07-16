import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-component',
  imports: [RouterModule],
  templateUrl: './admin-component.component.html',
  styleUrl: './admin-component.component.css'
})
export class AdminComponentComponent {
  constructor(private http: HttpClient) {}

  exportExcel() {
    const token = localStorage.getItem("authToken"); 
    if (!token) {
      console.error("Token JWT não encontrado.");
      return;
    }
    this.http.get('https://localhost:7140/api/admin/export/all', { responseType: 'blob', headers: {
      Authorization: `Bearer ${token}`
    } }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FreyrFund_Export_${new Date().toISOString().slice(0, 19)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

