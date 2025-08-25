// compte.state.ts
import { Compte } from './compte.model';

export interface CompteState {
  data: Compte;
}

export const compteInitialState: CompteState = {
  data: {
    id: '',
    cpt_num: '',
    cpt_nom: '',
    cpt_etat: 0
  },
};

export interface ComptesListState {
  comptes: Compte[]; // ✅ tableau simple
}

export const comptesListInitialState: ComptesListState = {
  comptes: [],
};

// import { Compte } from './compte.model';

// export interface CompteState {
//   data: Compte;
// }

// export const compteInitialState: CompteState = {
//   data: {
//     id: '',
//     cpt_num: '',
//     cpt_nom: '',
//     cpt_etat: 0
//   },
// };

// export interface CompteFilters {
//   cpt_id?: number;
//   cpt_num?: string;
//   cpt_nom?: string;
//   cpt_etat?: number;
//   limit?: number;
//   offset?: number;
// }
// export interface Comptes {
//   entities: Compte[];
//   // compteCount: number;
// }

// export interface ComptesListConfig {
//   currentPage?: number;
//   filters?: CompteFilters;
// }

// export interface ComptesList {
//   entities: Compte[];
//   // comptesCount: number;
// }

// export interface ComptesListState {
//   // listConfig: ComptesListConfig;
//   // comptes: ComptesList;
//   comptes: Compte[];
// }

// export const comptesListInitialState: ComptesListState = {
//   // listConfig: {
//   //   currentPage: 1,
//   //   filters: {
//   //     limit: 10,
//   //   },
//   // },
//   comptes: []
//   // comptes: {
//   //   entities: []
//   //   // comptesCount: 0,
//   // },
// };
