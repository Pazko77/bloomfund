import { Router } from 'express';
import { ProjetController } from '../controllers/Projet.controller';
import { authenticateToken } from '../middlewares/Utilisateur.middleware';

const projetRouter = Router();

projetRouter.get('/', ProjetController.getAll);
projetRouter.get('/:id', ProjetController.getOne);
projetRouter.post('/', authenticateToken, ProjetController.create);
projetRouter.put('/:id', authenticateToken, ProjetController.update);
projetRouter.delete('/:id', authenticateToken, ProjetController.delete);

export default projetRouter;