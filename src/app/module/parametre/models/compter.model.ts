  export interface Compter {
    id: string;
    cpr_id: number;
      cpt_id: number;
      cpr_num: string;
      cpr_nom: string;
      cpr_etat: number;
        etat: number;
  }

  export interface NewCompter {
    compter: {
    cpr_id: number;
      cpt_id: number;
      cpr_num: string;
      cpr_nom: string;
      cpr_etat: number;
        };
  }

  export interface CompterResponse {
    compter: Compter;
  }
