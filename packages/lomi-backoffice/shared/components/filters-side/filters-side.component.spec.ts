import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersSideComponent } from './filters-side.component';

describe('FiltersSideComponent', () => {
  let component: FiltersSideComponent;
  let fixture: ComponentFixture<FiltersSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersSideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
