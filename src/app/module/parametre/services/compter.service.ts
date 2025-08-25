import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@libs/core/http-client/api.service';
import {
  Compter,
  CompterResponse,
  NewCompter,
} from '../models/compter.model';
import { HttpParams } from '@angular/common/http';
import { ComptersListConfig } from '../models/compter.state';

@Injectable({ providedIn: 'root' })
export class CompterService {
  private readonly apiService = inject(ApiService);

  getCompter(id: string): Observable<CompterResponse> {
    return this.apiService.get<CompterResponse>('/compters/' + id);
  }
  allCompter(): Observable<CompterResponse> {
    return this.apiService.get<CompterResponse>('/compters');
  }

  query(config: ComptersListConfig): Observable<{ compters: Compter[]; comptersCount: number }> {
    return this.apiService.get('/compters' ,this.toHttpParams(config.filters));
  }

  addCompter(compter: NewCompter): Observable<CompterResponse> {
    return this.apiService.post<CompterResponse, NewCompter>('/compters/', compter);
  }

  editCompter(compter: Compter): Observable<CompterResponse> {
    return this.apiService.put<CompterResponse, CompterResponse>('/compters/' + compter.id, compter);
  }

  deleteCompter(id: string): Observable<void> {
    return this.apiService.delete<void>('/compters/' + id);
  }

  private toHttpParams(params: any) {
    return Object.getOwnPropertyNames(params).reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }
}
