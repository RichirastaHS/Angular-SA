import { query } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UdaService } from '../../service/uda.service';
import { SearchService } from '../../service/search.service';
import { CommonModule } from '@angular/common';
import { Document } from '../../models/document';

@Component({
  selector: 'app-documentfound',
  imports: [CommonModule],
  templateUrl: './documentfound.component.html',
  styleUrl: './documentfound.component.css'
})
export class DocumentfoundComponent {
  document: Document[] = [];
  busqueda: string = '';
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private udaService: UdaService,
  ) { }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['query'];
      if(query){
        this.busqueda = query;
        this.udaService.searchDocuments(query).subscribe({
          next: (response) => {
            this.document = response.documentsSearch 
            console.log(this.document);
          },
          error: (error) => {
            console.error('Error fetching documents:', error);
          }
        });
      }
    });
  }

  openDocument(id: string): void {
    
  }
}
