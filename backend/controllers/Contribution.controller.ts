import { Request, Response } from "express";
import { ContributionService } from "../services/Contribution.service";

export const ContributionController = {
  // CREATE
  async create(req: Request, res: Response) {
    const utilisateur_id = req.Utilisateur?.id;
    if (!utilisateur_id) return res.sendStatus(401);

    const success = await ContributionService.create(req.body);
    if (!success) {
      return res.status(500).json({ message: "Erreur contribution" });
    }

    return res.status(201).json({ success: true });
  },

  // READ BY PROJET
  async getByProjet(req: Request, res: Response) {
    const projet_id = Number(req.params.projetId);
    const contributions = await ContributionService.findByProjet(projet_id);
    return res.json(contributions);
  },

 
};
