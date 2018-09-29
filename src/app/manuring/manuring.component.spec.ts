import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuringComponent } from './manuring.component';

describe('ManuringComponent', () => {
  let component: ManuringComponent;
  let fixture: ComponentFixture<ManuringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManuringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
