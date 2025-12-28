import { Router } from "express";
import { ContributionController } from "../controllers/Contribution.controller";
import { authenticateToken } from "../middlewares/Utilisateur.middleware";

const contributionRouter = Router();

contributionRouter.post("/", authenticateToken, ContributionController.create);
contributionRouter.get("/projet/:projetId", ContributionController.getByProjet);


export default contributionRouter;
