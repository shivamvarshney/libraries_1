import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AafGridComponent } from './aaf-grid.component';

describe('AafGridComponent', () => {
  let component: AafGridComponent;
  let fixture: ComponentFixture<AafGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AafGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AafGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
