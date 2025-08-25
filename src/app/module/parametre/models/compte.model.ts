  export interface Compte {
    id?: string;
    cpt_num?: string;
    cpt_nom?: string;
    cpt_etat?: number;
  }

  export interface NewCompte {
      cpt_num: string;
      cpt_nom: string;
      cpt_etat?: number;
  }

  export interface CompteResponse {
    compte: Compte;
  }
