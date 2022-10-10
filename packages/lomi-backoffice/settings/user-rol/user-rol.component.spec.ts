import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolComponent } from './user-rol.component';

describe('UserRolComponent', () => {
  let component: UserRolComponent;
  let fixture: ComponentFixture<UserRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
