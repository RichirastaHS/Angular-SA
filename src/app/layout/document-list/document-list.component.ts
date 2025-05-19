import {Component, HostListener, ElementRef, viewChild, ViewChild, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TableRComponent } from "../table-r/table-r.component";
import { ExcelExportService } from '../../service/excel-export.service';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-document-list',
  imports: [MatSelectModule, CommonModule, MatButtonModule, MatMenuModule, MatButtonModule, TableRComponent, ReactiveFormsModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})


export class DocumentListComponent{

  filtersform = new FormGroup({
    category_id: new FormControl<string>(''),
    start_date: new FormControl<string>(''),
    end_date: new FormControl<string>('')
  });
  
  isOpen = false;
  buttonText = 'Menu';
  statusId: number = 0;
  constructor(
    private excelExportService: ExcelExportService,
    private elementRef: ElementRef
  ) {}
  
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Evita que el clic se propague al document
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.dropdownContainer.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: KeyboardEvent): void {
    this.isOpen = false;
  }

  onExportClick() {
    this.excelExportService.requestExport();
  }
  setid(number: number){
    this.statusId = number;
  }

  onSubmit() {
    const formData = this.filtersform.value;
    console.log('Formulario enviado:', formData);
    // Aquí puedes realizar la lógica para enviar los datos del formulario al backend
  }

  resetFilters() {
    this.filtersform.reset();
  }
}
