import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyUserComponent } from './edit-my-user.component';

describe('EditMyUserComponent', () => {
  let component: EditMyUserComponent;
  let fixture: ComponentFixture<EditMyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMyUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
