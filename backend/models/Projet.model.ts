export type Statut = "publie" | "brouillon" | "verifie" | "archive";

/**
 * Représentation d’un projet dans le système
 */
export interface Projet {
  id: number;
  titre: string;
  description: string;
  objectif_financier: number;
  montant_collecte: number;
  localisation?: string;
  statut: Statut;
  date_creation: Date;
  date_fin?: Date;
  porteur_id: number;
  categorie_id?: number;
}

/**
 * Données nécessaires à la création d’un projet
 */
export interface ProjetInput {
  titre: string;
  description: string;
  objectif_financier: number;
  localisation?: string;
  date_fin?: Date;
  categorie_id?: number;
  porteur_id: number;
}
