import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenToolsComponent } from './pen-tools.component';

describe('PenToolsComponent', () => {
  let component: PenToolsComponent;
  let fixture: ComponentFixture<PenToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
