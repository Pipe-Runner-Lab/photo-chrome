import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropToolsComponent } from './crop-tools.component';

describe('CropToolsComponent', () => {
  let component: CropToolsComponent;
  let fixture: ComponentFixture<CropToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
