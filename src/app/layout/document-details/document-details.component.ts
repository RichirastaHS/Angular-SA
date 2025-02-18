import { ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiResponse, Comment, Document } from '../../models/document';
import { CommonModule } from '@angular/common';
indexedDB

@Component({
  selector: 'app-document-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css'
})
export class DocumentDetailsComponent {
  
  document!: Document ;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el id del documento
    if(id){
      this.dataService.getDocumentbyId(+id).subscribe({  
        next: (response: ApiResponse) => {
          this.document = response.document; // ✅ Ahora `document` solo contiene la información necesaria
          console.log(this.document);
        },
        error: (error) => {
          console.log(error); 
        }
      });
    }
  }

}

/*
category: {id: 1, name: 'Oficio'}
category_id: 
1
created_at: 
"2025-02-09T08:18:10.000000Z"
created_by: 
1
description: 
"Descripción de Documento 1"
id: 
1
received_date: 
"2025-02-09"
status: 
{id: 1, name: 'En proceso'}
status_id: 
1
title: 
"Nombre de Documento 1"
updated_at: 
"2025-02-09T08:18:10.000000Z"
user: 
id: 
1
name: 
"Test User"
*/