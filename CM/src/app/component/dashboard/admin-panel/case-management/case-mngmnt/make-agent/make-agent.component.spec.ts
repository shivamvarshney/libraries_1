import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeAgentComponent } from './make-agent.component';

describe('MakeAgentComponent', () => {
  let component: MakeAgentComponent;
  let fixture: ComponentFixture<MakeAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
