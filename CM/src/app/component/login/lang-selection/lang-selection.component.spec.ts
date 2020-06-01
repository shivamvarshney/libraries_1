import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangSelectionComponent } from './lang-selection.component';

describe('LangSelectionComponent', () => {
  let component: LangSelectionComponent;
  let fixture: ComponentFixture<LangSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
