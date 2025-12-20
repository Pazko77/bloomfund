/**
 * Représentation d'une catégorie.
 */
export interface Categorie {
	id: number;
	nom: string;
	description?: string;
	date_creation: Date;
}

/**
 * Données nécessaires à la création d'une catégorie.
 */
export interface CategorieInput {
	nom: string;
	description?: string;
}
