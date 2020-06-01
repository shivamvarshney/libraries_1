import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreAirtelAfricaComponent } from './core-airtel-africa.component';

describe('CoreAirtelAfricaComponent', () => {
  let component: CoreAirtelAfricaComponent;
  let fixture: ComponentFixture<CoreAirtelAfricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreAirtelAfricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreAirtelAfricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
