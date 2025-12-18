import { Router } from 'express';
import { UtilisateurController  } from '../controllers/Utilisateur.controller';
import { authenticateToken } from '../middlewares/Utilisateur.middleware';
const userRoutes = Router();

userRoutes.post('/register', UtilisateurController.register);
userRoutes.post('/login', UtilisateurController.login);
userRoutes.post('/logout', UtilisateurController.logout);
userRoutes.get('/profile', authenticateToken, UtilisateurController.profile);


export default userRoutes;
