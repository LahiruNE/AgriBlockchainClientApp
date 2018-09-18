import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationhomeComponent } from './certificationhome.component';

describe('CertificationhomeComponent', () => {
  let component: CertificationhomeComponent;
  let fixture: ComponentFixture<CertificationhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificationhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
