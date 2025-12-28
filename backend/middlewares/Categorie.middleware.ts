import { Request, Response, NextFunction } from "express";

/**
 * Autorise uniquement les administrateurs
 * à modifier les catégories.
 */
export function authorizeCategorieAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.Utilisateur) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  if (req.Utilisateur.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès réservé aux administrateurs" });
  }

  next();
}
