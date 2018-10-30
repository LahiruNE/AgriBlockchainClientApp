import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivideDashboardComponent } from './divide-dashboard.component';

describe('DivideDashboardComponent', () => {
  let component: DivideDashboardComponent;
  let fixture: ComponentFixture<DivideDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivideDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivideDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
