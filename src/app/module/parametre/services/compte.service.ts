import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@libs/core/http-client/api.service';
import { Compte, CompteResponse, NewCompte } from '../models/compte.model';
import { map } from 'rxjs/operators'; // ✅ opérateur RxJS à importer

@Injectable({ providedIn: 'root' })
export class CompteService {
  private readonly apiService = inject(ApiService);

  getCompte(id: string): Observable<CompteResponse> {
    return this.apiService.get<CompteResponse>('/api/comptes/' + id);
  }

  // si ton API renvoie déjà { comptes: [], comptesCount: N }
  allCompte(): Observable<{ comptes: Compte[]; comptesCount: number }> {
    return this.apiService.get<{ comptes: Compte[]; comptesCount: number }>('/api/comptes');
  }

  // si ton API renvoie juste un tableau brut []
  query(): Observable<{ comptes: Compte[] }> {
    return this.apiService.get<Compte[]>('/api/comptes').pipe(
      map((data: Compte[]) => ({ comptes: data }))  // ✅ adaptation
    );
  }

  addCompte(compte: NewCompte): Observable<CompteResponse> {
    return this.apiService.post<CompteResponse, NewCompte>('/api/comptes/', compte);
  }

  editCompte(compte: Compte): Observable<CompteResponse> {
    return this.apiService.put<CompteResponse, CompteResponse>(
      '/api/comptes/' + compte.id,
      { compte }
    );
  }

  deleteCompte(id: string): Observable<void> {
    return this.apiService.delete<void>('/api/comptes/' + id);
  }
}