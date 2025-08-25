  export interface Mode {
    id: string;
    mod_id: number;
      mod_nom: string;
      mod_etat: number;
        etat: number;
  }

  export interface NewMode {
    mode: {
    mod_id: number;
      mod_nom: string;
      mod_etat: number;
        };
  }

  export interface ModeResponse {
    mode: Mode;
  }
