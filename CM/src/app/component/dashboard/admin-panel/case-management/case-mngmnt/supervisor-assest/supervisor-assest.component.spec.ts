import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorAssestComponent } from './supervisor-assest.component';

describe('SupervisorAssestComponent', () => {
  let component: SupervisorAssestComponent;
  let fixture: ComponentFixture<SupervisorAssestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorAssestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorAssestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
