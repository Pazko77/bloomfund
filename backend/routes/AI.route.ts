import { Router } from 'express';
import { AIController } from '../controllers/AI.controller';
import { authenticateToken } from '../middlewares/Utilisateur.middleware';

const aiRouter = Router();

// Route protégée - nécessite une authentification
aiRouter.post('/generate-description', authenticateToken, AIController.generateDescription);

export default aiRouter;
