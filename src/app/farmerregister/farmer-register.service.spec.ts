import { TestBed, inject } from '@angular/core/testing';

import { FarmerRegisterService } from './farmer-register.service';

describe('FarmerRegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FarmerRegisterService]
    });
  });

  it('should ...', inject([FarmerRegisterService], (service: FarmerRegisterService) => {
    expect(service).toBeTruthy();
  }));
});
