import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeMaskToolsComponent } from './shape-mask-tools.component';

describe('ShapeMaskToolsComponent', () => {
  let component: ShapeMaskToolsComponent;
  let fixture: ComponentFixture<ShapeMaskToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeMaskToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeMaskToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
