import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyAssestComponent } from './monthly-assest.component';

describe('MonthlyAssestComponent', () => {
  let component: MonthlyAssestComponent;
  let fixture: ComponentFixture<MonthlyAssestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyAssestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyAssestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
