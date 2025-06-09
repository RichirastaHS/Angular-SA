import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficioComponent } from './oficio.component';

describe('OficioComponent', () => {
  let component: OficioComponent;
  let fixture: ComponentFixture<OficioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OficioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
