import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAssestComponent } from './daily-assest.component';

describe('DailyAssestComponent', () => {
  let component: DailyAssestComponent;
  let fixture: ComponentFixture<DailyAssestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAssestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAssestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
