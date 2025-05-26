import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UdaService } from '../../service/uda.service';
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
  isempty: boolean = false;
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
            if(response.documentsSearch.length>0){
              this.document = response.documentsSearch 
              this.isempty = false;
            }
            else{
              this.isempty = true;
            }
          },
          error: (error) => {
          }
        });
      }
    });
  }

  openDocument(id: string): void {
    this.router.navigate(['/main/detalles', id]);
  }
}
