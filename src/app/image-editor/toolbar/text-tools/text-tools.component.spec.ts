import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextToolsComponent } from './text-tools.component';

describe('TextToolsComponent', () => {
  let component: TextToolsComponent;
  let fixture: ComponentFixture<TextToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
