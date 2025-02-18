import { Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Route } from '@angular/router';
import { Document, Category, Status } from '../../models/document';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-document',
  imports: [CommonModule],
  templateUrl: './edit-document.component.html',
  styleUrl: './edit-document.component.css'
})
export class EditDocumentComponent {
  document: any = {};
  categories: Category[] = [];
  statuses: Status[] = [];

  constructor(
    private dataService: DataService, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.dataService.editDocument(+id).subscribe({
        next: (response) => {
          this.document = response.document;
          this.categories = response.categories;
          this.statuses = response.statuses;
          this.document.created_at = this.formatDate(this.document.created_at);
        },
        error: (error) => {
          console.log(error);
        }
      });
    } 
  }
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Devuelve formato "yyyy-MM-dd"
  }
}
