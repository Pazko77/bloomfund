import { Request, Response } from "express";
import { CategorieService } from "../services/categorie.service";
export const CategorieController = {
  // GET ALL CATEGORIES
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await CategorieService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des catégories" });
    }
  },
  // GET CATEGORIE BY ID
  async getCategorieById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const categorie = await CategorieService.getCategorieById(id);

      if (!categorie) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }

      res.status(200).json(categorie);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // CREATE CATEGORIE
  async createCategorie(req: Request, res: Response) {
    try {
      const { nom, description } = req.body;

      if (!nom) {
        return res.status(400).json({ message: "Le nom est requis" });
      }

      const id = await CategorieService.createCategorie({ nom, description });
      res.status(201).json({ id, nom, description });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la création de la catégorie" });
    }
  },
  // UPDATE CATEGORIE
  async updateCategorie(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nom, description } = req.body;
      const updated = await CategorieService.updateCategorie(id, {
        nom,
        description,
      });
      if (!updated) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      res.status(200).json({ id, nom, description });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de la catégorie" });
    }
  },
  // DELETE CATEGORIE
  async deleteCategorie(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = await CategorieService.deleteCategorie(id);

      if (!deleted) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  },
};
