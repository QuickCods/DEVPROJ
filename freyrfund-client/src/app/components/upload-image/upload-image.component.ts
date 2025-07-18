import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [ NgIf],
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css'],
})
export class UploadImageComponent {
  @Output() imageUploaded = new EventEmitter<string>();

  selectedFile?: File | null = null;
  imageUrl: string = '';            
  uploadSuccess: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
  }

  uploadImage() {
    if (!this.selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.http.post<{ imageUrl: string }>('https://localhost:5001/api/upload/imagem', formData)
      .subscribe({
        next: (res) => {
          this.uploadSuccess = true;
          this.imageUrl = `https://localhost:5001/${res.imageUrl}`;
        },
        error: (err) => {
          console.error('Erro no upload:', err);
          this.uploadSuccess = false;
        }
      });
  }
  
}
