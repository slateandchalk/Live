import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadDetailsComponent } from './head-details.component';

describe('HeadDetailsComponent', () => {
  let component: HeadDetailsComponent;
  let fixture: ComponentFixture<HeadDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
