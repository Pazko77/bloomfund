import pool from "../config/db";
import { Commentaire, CommentaireInput } from '../models/Commentaire.model';




export  const CommentaireService = {


    async getCommentairesByProjetId(projetId: number): Promise<Commentaire[]> {
        try {
            const [rows] = await pool.query(
                "SELECT Commentaires.*, Utilisateurs.nom, Utilisateurs.prenom FROM Commentaires INNER JOIN Utilisateurs ON Commentaires.utilisateur_id = Utilisateurs.id WHERE projet_id = ? ORDER BY date_commentaire DESC",
                [projetId]
            );
            return rows as Commentaire[];
        } catch (error) {
            console.error("Erreur lors de la récupération des commentaires :", error);
            return [];
        } 
    },
    async addCommentaire(commentaire: CommentaireInput): Promise<number> {
        try {
            const [result] = await pool.query('INSERT INTO Commentaires (contenu, utilisateur_id, projet_id, date_commentaire) VALUES (?, ?, ?, NOW())', [
                commentaire.contenu,
                commentaire.utilisateur_id,
                commentaire.projet_id,
            ]);
            const insertId = (result as any).insertId;
            return insertId;
        } catch (error) {
            console.error("Erreur lors de l'ajout du commentaire :", error);
            throw error;
        }
    }   ,
    async deleteCommentaire(id: number): Promise<boolean> {
        try {
            const [result] = await pool.query('DELETE FROM Commentaires WHERE id = ?', [id]);
            return (result as any).affectedRows > 0;
        } catch (error) {
            console.error('Erreur lors de la suppression du commentaire :', error);
            return false;
        }
    }   

}