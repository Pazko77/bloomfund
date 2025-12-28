import { UtilisateurOutput } from "../models/Utilisateur.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: string = process.env.JWT_SECRET || "supersecrety";

export function generateAccessToken(user: UtilisateurOutput): string {
  return jwt.sign(user, SECRET_KEY, { expiresIn: "15m" });
}
