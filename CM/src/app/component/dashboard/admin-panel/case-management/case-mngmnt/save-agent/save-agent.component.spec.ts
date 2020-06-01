import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAgentComponent } from './save-agent.component';

describe('SaveAgentComponent', () => {
  let component: SaveAgentComponent;
  let fixture: ComponentFixture<SaveAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
