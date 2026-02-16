import express from "express";
import { ContrepartieController } from "../controllers/Contrepartie.controller";
import { authenticateToken } from "../middlewares/Utilisateur.middleware";

const contrepartieRouter = express.Router();

// Routes publiques
contrepartieRouter.get("/projet/:projetId", ContrepartieController.getByProjet);
contrepartieRouter.get("/:id", ContrepartieController.getOne);

// Routes protégées (authentification requise)
contrepartieRouter.post("/", authenticateToken, ContrepartieController.create);
contrepartieRouter.put("/:id", authenticateToken, ContrepartieController.update);
contrepartieRouter.delete("/:id", authenticateToken, ContrepartieController.delete);

export default contrepartieRouter;
