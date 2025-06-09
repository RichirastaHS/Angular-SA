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
    'En Tramite',
    'En Firma',
    'Firmado',
    'Archivado',
    'Cancelado',
  ];
  
  contenidoModal = '';
  selectstatus(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.contenidoModal = input.value
  }

  cerrarModal(): void {
  }
}
