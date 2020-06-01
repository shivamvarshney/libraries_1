import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadtemplateComponent } from './downloadtemplate.component';

describe('DownloadtemplateComponent', () => {
  let component: DownloadtemplateComponent;
  let fixture: ComponentFixture<DownloadtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
