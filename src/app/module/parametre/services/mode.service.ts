import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@libs/core/http-client/api.service';
import {
  Mode,
  ModeResponse,
  NewMode,
} from '../models/mode.model';
import { HttpParams } from '@angular/common/http';
import { ModesListConfig } from '../models/mode.state';

@Injectable({ providedIn: 'root' })
export class ModeService {
  private readonly apiService = inject(ApiService);

  getMode(id: string): Observable<ModeResponse> {
    return this.apiService.get<ModeResponse>('/modes/' + id);
  }
  allMode(): Observable<ModeResponse> {
    return this.apiService.get<ModeResponse>('/modes');
  }

  query(config: ModesListConfig): Observable<{ modes: Mode[]; modesCount: number }> {
    return this.apiService.get('/modes' ,this.toHttpParams(config.filters));
  }

  addMode(mode: NewMode): Observable<ModeResponse> {
    return this.apiService.post<ModeResponse, NewMode>('/modes/', mode);
  }

  editMode(mode: Mode): Observable<ModeResponse> {
    return this.apiService.put<ModeResponse, ModeResponse>('/modes/' + mode.id, mode);
  }

  deleteMode(id: string): Observable<void> {
    return this.apiService.delete<void>('/modes/' + id);
  }

  private toHttpParams(params: any) {
    return Object.getOwnPropertyNames(params).reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }
}
