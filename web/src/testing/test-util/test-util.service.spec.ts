import { TestBed } from '@angular/core/testing';

import { TestUtilService } from './test-util.service';

describe('TestUtilService', () => {
  let service: TestUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
