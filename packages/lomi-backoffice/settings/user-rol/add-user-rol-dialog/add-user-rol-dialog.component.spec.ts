import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserRolDialogComponent } from './add-user-rol-dialog.component';

describe('AddUserRolDialogComponent', () => {
  let component: AddUserRolDialogComponent;
  let fixture: ComponentFixture<AddUserRolDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserRolDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserRolDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
