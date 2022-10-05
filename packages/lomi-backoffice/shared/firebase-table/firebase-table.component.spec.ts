import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseTableComponent } from './firebase-table.component';

describe('FirebaseTableComponent', () => {
  let component: FirebaseTableComponent;
  let fixture: ComponentFixture<FirebaseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirebaseTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirebaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
