import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-contacto.component.html',
  styleUrls: ['./formulario-contacto.component.css']
})
export class FormularioContactoComponent {
  @Output() close = new EventEmitter<void>();

  nome: string = '';
  email: string = '';
  mensagem: string = '';

  fechar() {
    this.close.emit();
  }

  enviarFormulario() {
    // Aqui poderias implementar o envio para backend futuramente
    alert('Mensagem enviada com sucesso!');
    this.fechar(); // Fecha o formulário depois de enviar
  }
}
