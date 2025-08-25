import { Mode } from './mode.model';

export interface ModeState {
  data: Mode;
}

export const modeInitialState: ModeState = {
  data: {
    id: '',
    mod_id: 0,
      mod_nom: '',
      mod_etat: 0,
          etat: 1,
  },
};

export interface ModeFilters {
  mod_id?: number;
      mod_nom?: string;
      mod_etat?: number;
        limit?: number;
  offset?: number;
}
export interface Modes {
  entities: Mode[];
  modeCount: number;
}

export interface ModesListConfig {
  currentPage: number;
  filters: ModeFilters;
}

export interface ModesList {
  entities: Mode[];
  modesCount: number;
}

export interface ModesListState {
  listConfig: ModesListConfig;
  modes: ModesList;
}

export const modesListInitialState: ModesListState = {
  listConfig: {
    currentPage: 1,
    filters: {
      limit: 10,
    },
  },
  modes: {
    entities: [],
    modesCount: 0,
  },
};
