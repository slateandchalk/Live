import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadOptionsComponent } from './head-options.component';

describe('HeadOptionsComponent', () => {
  let component: HeadOptionsComponent;
  let fixture: ComponentFixture<HeadOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
