import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRComponent } from './table-r.component';

describe('TableRComponent', () => {
  let component: TableRComponent;
  let fixture: ComponentFixture<TableRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
