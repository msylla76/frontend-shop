import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { CompterStore } from './compter.store';

describe('CompterStore', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            CompterStore,
            provideHttpClientTesting() // Remplace HttpClientTestingModule
            ],
        });
    });

    it('should be created', inject([CompterStore], (service: typeof CompterStore) => {
        expect(service).toBeTruthy();
    }));
});
