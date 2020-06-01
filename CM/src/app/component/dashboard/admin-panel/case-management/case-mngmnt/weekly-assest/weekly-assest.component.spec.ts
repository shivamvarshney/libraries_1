import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyAssestComponent } from './weekly-assest.component';

describe('WeeklyAssestComponent', () => {
  let component: WeeklyAssestComponent;
  let fixture: ComponentFixture<WeeklyAssestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyAssestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyAssestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
