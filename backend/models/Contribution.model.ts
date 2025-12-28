export interface Contribution {
  id: number;
  montant: number;
  date_contribution: Date;
  utilisateur_id: number;
  projet_id: number;
}

export interface ContributionInput {
  montant: number;
  projet_id: number;
  utilisateur_id: number;
}
