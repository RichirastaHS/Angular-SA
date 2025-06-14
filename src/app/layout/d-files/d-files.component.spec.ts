import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DFilesComponent } from './d-files.component';

describe('DFilesComponent', () => {
  let component: DFilesComponent;
  let fixture: ComponentFixture<DFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
