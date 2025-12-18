/**
 * Representation d'un utilisateur dans le système.
 *
 * @export
 * @interface Utilisateur
 * @typedef {Utilisateur}
 */
export interface Utilisateur {
	id: number;
	nom: string;
	prenom: string;
	email: string;
	mot_de_passe: string;
	departement: string;
	role: 'citoyen' | 'porteur_projet' | 'admin';
	date_inscription: Date;
}

/**
 * utilisateur input pour la création d'un nouvel utilisateur.
 *
 * @export
 * @interface UtilisateurInput
 * @typedef {UtilisateurInput}
 */
export interface UtilisateurInput {
	nom: string;
	prenom: string;
	email: string;
	mot_de_passe: string;
  departement: string;
	role: 'citoyen' | 'porteur_projet' | 'admin';
}



/** * Payload contenu dans le JWT pour un utilisateur.
 *
 * @export
 * @interface UtilisateurPayload
 * @typedef {UtilisateurPayload}
 */
export interface UtilisateurPayload {
	id: number;
	email: string;
}
declare module 'express-serve-static-core' {
	interface Request {
		Utilisateur?: UtilisateurPayload;
	}
}