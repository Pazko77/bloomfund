import { Request, Response } from 'express';
import { CommentaireService } from '../services/Commentaire.service';



export const CommentaireController = {
    async getCommentairesByProjetId(req: Request, res: Response) {
       try {
        const projetId = parseInt(req.params.projetId, 10);
        const commentaires = await CommentaireService.getCommentairesByProjetId(projetId);
        return  res.json({ commentaires, success: true });
       } catch (error) {
        console.error("Erreur dans le contrôleur lors de la récupération des commentaires :", error);
        return res.status(500).json({ message: "Erreur serveur", success: false });
       }
    },
    async addCommentaire(req: Request, res: Response) {
        try {
            const commentaireData  = req.body;
            const newCommentaireId = await CommentaireService.addCommentaire(commentaireData);
            return res.json({ message: 'Commentaire ajouté', commentaireId: newCommentaireId, success: true });
        } catch (error) {
            console.error("Erreur dans le contrôleur lors de l'ajout du commentaire :", error);
            return res.status(500).json({ message: 'Erreur serveur', success: false });
        }
    }   ,
    async deleteCommentaire(req: Request, res: Response) {
        try {
            const commentaireId = parseInt(req.params.id, 10);
            const success = await CommentaireService.deleteCommentaire(commentaireId);
            if (success) {
                return res.json({ message: 'Commentaire supprimé', success: true });
            } else {
                return res.status(404).json({ message: 'Commentaire non trouvé', success: false });
            }   
        } catch (error) {
            console.error("Erreur dans le contrôleur lors de la suppression du commentaire :", error);
            return res.status(500).json({ message: 'Erreur serveur', success: false });
        }   
    }

}