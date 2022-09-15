import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWithoutRolComponent } from './user-without-rol.component';

describe('UserWithoutRolComponent', () => {
  let component: UserWithoutRolComponent;
  let fixture: ComponentFixture<UserWithoutRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserWithoutRolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserWithoutRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
