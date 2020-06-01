import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AafModalComponent } from './aaf-modal.component';

describe('AafModalComponent', () => {
  let component: AafModalComponent;
  let fixture: ComponentFixture<AafModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AafModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AafModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
