import { Router } from "express";
import { UtilisateurController } from "../controllers/Utilisateur.controller";
import { authenticateToken } from "../middlewares/Utilisateur.middleware";
const userRoutes = Router();

userRoutes.post("/register", UtilisateurController.register);
userRoutes.post("/login", UtilisateurController.login);
userRoutes.post('/refresh-token', UtilisateurController.refreshToken);
userRoutes.post('/google-login', UtilisateurController.googleLogin);
userRoutes.post("/logout", UtilisateurController.logout);
userRoutes.get("/profile", authenticateToken, UtilisateurController.profile);
userRoutes.put('/profile/update', authenticateToken, UtilisateurController.updateProfile);
userRoutes.put('/password', authenticateToken, UtilisateurController.changePassword);

export default userRoutes;
