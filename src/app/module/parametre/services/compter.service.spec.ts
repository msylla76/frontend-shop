  import { TestBed } from '@angular/core/testing';
  import { CompterService } from './compter.service';

  describe('CompterService', () => {
    let service: CompterService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(CompterService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });
