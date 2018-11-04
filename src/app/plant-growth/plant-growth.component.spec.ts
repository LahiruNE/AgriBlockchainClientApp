import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantGrowthComponent } from './plant-growth.component';

describe('PlantGrowthComponent', () => {
  let component: PlantGrowthComponent;
  let fixture: ComponentFixture<PlantGrowthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantGrowthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
