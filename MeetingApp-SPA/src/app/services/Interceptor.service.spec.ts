/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Interceptor } from './Interceptor.service';

describe('Service: Interceptor.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Interceptor]
    });
  });

  it('should ...', inject([Interceptor], (service: Interceptor) => {
    expect(service).toBeTruthy();
  }));
});
