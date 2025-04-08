import { ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiResponse, Document } from '../../models/document';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-document-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css'
})
export class DocumentDetailsComponent {
  
  dtfEs = new Intl.DateTimeFormat('es');

  document!: Document;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private NotificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el id del documento
    if(id){
      this.dataService.getDocumentbyId(id).subscribe({  
        next: (response: ApiResponse) => {
          this.document = response.document; 
          console.log(this.document);
        },
        error: (error) => {
          console.log(error); 
        }
      });
    }
  }

  deletedoc(){
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el id del documento
    if(id){
      this.dataService.deleteDocument(id).subscribe({  
        next: (response: ApiResponse) => {
          this.router.navigate(['/main']);
            this.NotificationService.showSuccess('Documento borrado con exito'); // Muestra la notificación de éxito
        },
        error: (error) => {
          console.log(error); 
        }
      });
    }
  }

}