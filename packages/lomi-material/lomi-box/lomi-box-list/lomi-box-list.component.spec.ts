import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LomiBoxListComponent } from './lomi-box-list.component';

describe('LomiBoxListComponent', () => {
  let component: LomiBoxListComponent;
  let fixture: ComponentFixture<LomiBoxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LomiBoxListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LomiBoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
