import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ModeStore } from './mode.store';

describe('ModeStore', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            ModeStore,
            provideHttpClientTesting() // Remplace HttpClientTestingModule
            ],
        });
    });

    it('should be created', inject([ModeStore], (service: typeof ModeStore) => {
        expect(service).toBeTruthy();
    }));
});
