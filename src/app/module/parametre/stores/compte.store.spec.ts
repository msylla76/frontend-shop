import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { CompteStore } from './compte.store';

describe('CompteStore', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            CompteStore,
            provideHttpClientTesting() // Remplace HttpClientTestingModule
            ],
        });
    });

    it('should be created', inject([CompteStore], (service: typeof CompteStore) => {
        expect(service).toBeTruthy();
    }));
});
