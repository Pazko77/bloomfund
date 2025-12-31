import { Router } from "express";
import { CommentaireController } from "../controllers/commentaire.controller";
import { authenticateToken } from '../middlewares/Utilisateur.middleware';

const CommentaireRouter = Router();

// Récupérer les commentaires d'un projet
CommentaireRouter.get('/projet/:projetId', CommentaireController.getCommentairesByProjetId);

CommentaireRouter.post('/', authenticateToken, CommentaireController.addCommentaire);

CommentaireRouter.delete('/:id', authenticateToken, CommentaireController.deleteCommentaire);

export default CommentaireRouter;