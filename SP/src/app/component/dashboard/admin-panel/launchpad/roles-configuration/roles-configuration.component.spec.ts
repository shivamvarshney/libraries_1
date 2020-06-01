import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesConfigurationComponent } from './roles-configuration.component';

describe('RolesConfigurationComponent', () => {
  let component: RolesConfigurationComponent;
  let fixture: ComponentFixture<RolesConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
