import { Compter } from './compter.model';

export interface CompterState {
  data: Compter;
}

export const compterInitialState: CompterState = {
  data: {
    id: '',
    cpr_id: 0,
      cpt_id: 0,
      cpr_num: '',
      cpr_nom: '',
      cpr_etat: 0,
          etat: 1,
  },
};

export interface CompterFilters {
  cpr_id?: number;
      cpt_id?: number;
      cpr_num?: string;
      cpr_nom?: string;
      cpr_etat?: number;
        limit?: number;
  offset?: number;
}
export interface Compters {
  entities: Compter[];
  compterCount: number;
}

export interface ComptersListConfig {
  currentPage: number;
  filters: CompterFilters;
}

export interface ComptersList {
  entities: Compter[];
  comptersCount: number;
}

export interface ComptersListState {
  listConfig: ComptersListConfig;
  compters: ComptersList;
}

export const comptersListInitialState: ComptersListState = {
  listConfig: {
    currentPage: 1,
    filters: {
      limit: 10,
    },
  },
  compters: {
    entities: [],
    comptersCount: 0,
  },
};
