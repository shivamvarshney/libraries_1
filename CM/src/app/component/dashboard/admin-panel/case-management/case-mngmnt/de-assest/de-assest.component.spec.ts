import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeAssestComponent } from './de-assest.component';

describe('DeAssestComponent', () => {
  let component: DeAssestComponent;
  let fixture: ComponentFixture<DeAssestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeAssestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeAssestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
