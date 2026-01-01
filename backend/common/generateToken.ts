import { UtilisateurOutput } from "../models/Utilisateur.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: string = process.env.JWT_SECRET || "supersecrety";

export function generateAccessToken(user: UtilisateurOutput): string {
  return jwt.sign(
		{
			id: user.id,
			email: user.email,
			role: user.role,
			nom: user.nom,
			prenom: user.prenom,
			date_inscription: user.date_inscription,
			departement: user.departement,
		},
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
}
