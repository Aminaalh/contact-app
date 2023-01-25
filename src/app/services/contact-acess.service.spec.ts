import { TestBed } from '@angular/core/testing';

import { ContactAccessService } from './contact-acess.service';

describe('ContactAcessService', () => {
  let service: ContactAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
