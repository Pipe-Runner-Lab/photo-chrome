import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterToolsComponent } from './filter-tools.component';

describe('FilterToolsComponent', () => {
  let component: FilterToolsComponent;
  let fixture: ComponentFixture<FilterToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
