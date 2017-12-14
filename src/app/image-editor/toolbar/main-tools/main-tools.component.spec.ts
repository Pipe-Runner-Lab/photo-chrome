import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainToolsComponent } from './main-tools.component';

describe('MainToolsComponent', () => {
  let component: MainToolsComponent;
  let fixture: ComponentFixture<MainToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
