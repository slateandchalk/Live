import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalMessagesComponent } from './approval-messages.component';

describe('ApprovalMessagesComponent', () => {
  let component: ApprovalMessagesComponent;
  let fixture: ComponentFixture<ApprovalMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
