import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeDashboardComponent } from './de-dashboard.component';

describe('DeDashboardComponent', () => {
  let component: DeDashboardComponent;
  let fixture: ComponentFixture<DeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
