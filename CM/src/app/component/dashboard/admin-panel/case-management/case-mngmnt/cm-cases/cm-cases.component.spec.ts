import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmCasesComponent } from './cm-cases.component';

describe('CmCasesComponent', () => {
  let component: CmCasesComponent;
  let fixture: ComponentFixture<CmCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
