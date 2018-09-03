import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterstakeholderComponent } from './registerstakeholder.component';

describe('RegisterstakeholderComponent', () => {
  let component: RegisterstakeholderComponent;
  let fixture: ComponentFixture<RegisterstakeholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterstakeholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterstakeholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
