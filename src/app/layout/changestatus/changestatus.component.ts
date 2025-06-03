import { Component } from '@angular/core';

@Component({
  selector: 'app-changestatus',
  imports: [],
  templateUrl: './changestatus.component.html',
  styleUrl: './changestatus.component.css',
})
export class ChangestatusComponent {
  estados = [
    'Recepcionado',
    'En Trámite',
    'Firmado',
    'Concluido',
    'Entregado',
    'Cancelado',
  ];
  modalAbierto = false;
  contenidoModal = '';

  selectstatus(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.contenidoModal = input.value
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }
}
