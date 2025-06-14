import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { DataService } from '../../service/data.service';
import { DocComponent } from '../../icons/doc/doc.component';
import { PdfComponent } from '../../icons/pdf/pdf.component';
import { XlsxComponent } from '../../icons/xlsx/xlsx.component';

interface ArchivoSubido {
  id: number; // Identificador único (puede ser un timestamp o un UUID)
  nombre: string; // Nombre del archivo (ej: "documento.pdf")
  tipo: string; // Tipo MIME (ej: "sapplication/pdf")
  tamaño: number; // Tamaño en bytes
  file: File; // Objeto File original (opcional, si necesitas enviarlo luego)
}
export interface FileData {
  id: number;
  document_id: string;
  original_name: string;
  stored_name: string;
  file_extension: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  uploaded_by: number;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-d-files',
  imports: [DocComponent, PdfComponent, XlsxComponent, ReactiveFormsModule],
  templateUrl: './d-files.component.html',
  styleUrl: './d-files.component.css',
})
export class DFilesComponent {
  @Input() idDoc!: string;
  @Input() files!: FileData[];
  constructor(
    private route: ActivatedRoute,
    private NotificationService: NotificationService,
    private dataService: DataService
  ) {}
  archivosSubidos: ArchivoSubido[] = [];
  FileArray: File[] = [];
  documentisEdit: boolean = false;

  filesform = new FormGroup({
    files: new FormControl<File[] | null>([]),
  });

  descargafile(idarchivo: number) {
    this.dataService.downloadDocFile(this.idDoc, idarchivo).subscribe({
      next: (value) => {
        const blob = value.body!;
        const contentDisposition = value.headers.get('content-disposition');

        // Nombre por defecto (sin extensión o con una genérica)
        let filename = 'archivo_descargado';

        if (contentDisposition) {
          // Extrae el nombre del archivo de content-disposition
          const filenameRegex =
            /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
          const matches = filenameRegex.exec(contentDisposition);

          if (matches != null && matches[1]) {
            filename = matches[1].trim();
          }
        }

        // Crear el enlace de descarga
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Limpieza
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        // Puedes manejar el error aquí, por ejemplo mostrando un mensaje al usuario
      },
    });
  }
  onFileArraySelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const extension = file.name.split('.').pop()?.toLowerCase();
      const extensionesPermitidas = ['pdf', 'xlsx', 'docx'];
      if (!extension || !extensionesPermitidas.includes(extension)) {
        this.NotificationService.showError(
          'Formato incorrecto',
          'Solo se permiten archivos PDF, XLSX o DOCX'
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.NotificationService.showError(
          'Archivo demasiado grande',
          'El tamaño máximo permitido es 5MB'
        );
        return;
      }

      const nuevoArchivo: ArchivoSubido = {
        id: Date.now(),
        nombre: file.name,
        tipo: extension,
        tamaño: file.size,
        file: file,
      };

      this.archivosSubidos.push(nuevoArchivo);
      this.FileArray.push(nuevoArchivo.file);

      // 🔽 Actualiza el valor del FormControl en el formulario reactivo
      this.filesform.patchValue({
        files: this.FileArray,
      });
    }
  }
  eliminarArchivo(id: number) {
    // Filtra el archivo fuera de archivosSubidos
    this.archivosSubidos = this.archivosSubidos.filter(
      (archivo) => archivo.id !== id
    );

    // Filtra también en FileArray
    this.FileArray = this.archivosSubidos.map((archivo) => archivo.file);

    // Actualiza el formulario
    this.filesform.patchValue({
      files: this.FileArray,
    });
  }

  onSubmit() {
    const formData = new FormData();
    const archivos = this.filesform.get('files')?.value;
    if (archivos && Array.isArray(archivos)) {
      archivos.forEach((file: File) => {
        formData.append('files[]', file); // 👈 nombre correcto
      });
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.uploadFiles(id, formData).subscribe({
        next: (response) => {
          setTimeout(() => {
            window.location.reload();
          }, 100);
          this.NotificationService.showSuccess(
            'Archivos subidos con exito',
            `Los archivos fueron subidos`
          ); // Muestra la notificación de éxito
        },
        error: (error) => {
          this.NotificationService.showError(
            'Error al subir archivos',
            error.error.message
          );
        },
      });
    }
  }
}
