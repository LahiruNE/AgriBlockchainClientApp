import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerregisterComponent } from './farmerregister.component';

describe('FarmerregisterComponent', () => {
  let component: FarmerregisterComponent;
  let fixture: ComponentFixture<FarmerregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
