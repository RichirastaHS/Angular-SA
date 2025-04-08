import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentfoundComponent } from './documentfound.component';

describe('DocumentfoundComponent', () => {
  let component: DocumentfoundComponent;
  let fixture: ComponentFixture<DocumentfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentfoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
