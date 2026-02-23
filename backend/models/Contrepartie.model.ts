export type TypeContrepartie = "physique" | "en_ligne";

/**
 * Représentation d'une contrepartie dans le système
 */
export interface Contrepartie {
	id: number;
	titre: string;
	description: string;
	montant_minimum: number;
	type: TypeContrepartie;
	quantite_disponible?: number;
	quantite_restante?: number;
	date_livraison_estimee?: Date;
	image_url?: string;
	projet_id: number;
	date_creation: Date;
}

/**
 * Données nécessaires à la création d'une contrepartie
 */
export interface ContrepartieInput {
	titre: string;
	description: string;
	montant_minimum: number;
	type: TypeContrepartie;
	quantite_disponible?: number;
	date_livraison_estimee?: Date;
	image_url?: string;
	projet_id: number;
}
