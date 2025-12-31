export interface Commentaire {
	id?: number;
	contenu: string;
	date_commentaire?: Date;
	utilisateur_id: number;
	projet_id: number;
}

export interface CommentaireInput {
	contenu: string;
	utilisateur_id: number;
	projet_id: number;
}