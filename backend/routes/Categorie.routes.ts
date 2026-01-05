import { Router } from "express";
import { CategorieController } from "../controllers/Categorie.controller";
import { authorizeCategorieAdmin } from "../middlewares/Categorie.middleware";
import { authenticateToken } from "../middlewares/Utilisateur.middleware";

const CategorieRouter = Router();

// Public routes
CategorieRouter.get("/", CategorieController.getAllCategories);
CategorieRouter.get("/:id", CategorieController.getCategorieById);

// 🔐 Routes protégées
CategorieRouter.post(
  "/",
  authenticateToken,
  authorizeCategorieAdmin,
  CategorieController.createCategorie,
);
CategorieRouter.delete(
  "/:id",
  authenticateToken,
  authorizeCategorieAdmin,
  CategorieController.deleteCategorie,
);
CategorieRouter.put(
  "/:id",
  authenticateToken,
  authorizeCategorieAdmin,
  CategorieController.updateCategorie,
);

export default CategorieRouter;
