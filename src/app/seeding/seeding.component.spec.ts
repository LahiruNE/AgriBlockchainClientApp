import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedingComponent } from './seeding.component';

describe('SeedingComponent', () => {
  let component: SeedingComponent;
  let fixture: ComponentFixture<SeedingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
