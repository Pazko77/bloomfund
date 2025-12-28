import { Request, Response } from "express";
import { generateAccessToken } from "../common/generateToken";
import { hashP } from "../common/hashPassword";
import { UtilisateurService } from "./../services/Utilisateur.service";
import bcrypt from "bcrypt";
import { Utilisateur, UtilisateurInput } from "./../models/Utilisateur.model";

export const UtilisateurController = {
  // REGISTER
  async register(req: Request, res: Response) {
    const UtilisateurCurrent: UtilisateurInput = req.body;
    // Hash the password
    UtilisateurCurrent.mot_de_passe = await hashP(
      UtilisateurCurrent.mot_de_passe,
    );

    const existing = await UtilisateurService.findByEmail(
      UtilisateurCurrent.email,
    );
    if (existing) {
      return res
        .status(400)
        .json({ message: "Utilisateur déjà existant", success: false });
    }

    const newUtilisateur = await UtilisateurService.create(UtilisateurCurrent);

    if (!newUtilisateur) {
      return res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur.",
        success: false,
      });
    }
    return res.json({ message: "Utilisateur cree !", success: true });
  },

  // LOGIN
  async login(req: Request, res: Response) {
    const UtilisateurCurrent: UtilisateurInput = req.body;
    const existingUtilisateur = await UtilisateurService.findByEmail(
      UtilisateurCurrent.email,
    );

    if (!existingUtilisateur) {
      return res
        .status(400)
        .json({ message: "Utilisateur non trouvé", success: false });
    }

    // Vérifie le mot de passe
    const isPasswordValid = await bcrypt.compare(
      UtilisateurCurrent.mot_de_passe,
      existingUtilisateur.mot_de_passe,
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Mot de passe incorrect", success: false });
    }

    // Add password verification and token generation logic here
    const token = generateAccessToken(existingUtilisateur);

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    return res.json({ token, success: true });
  },

  // LOGOUT
  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.json({ success: true });
  },

  // ROUTE PROTÉGÉE
  async profile(req: Request, res: Response) {
    return res.json({ Utilisateur: req.Utilisateur });
  },
};
