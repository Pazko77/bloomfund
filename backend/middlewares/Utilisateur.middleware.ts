import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UtilisateurPayload } from "../models/Utilisateur.model";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET!;

/**
 *
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {*}
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // format "Bearer TOKEN"
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, Utilisateur: any) => {
    if (err) {
      return res.status(403).json({ message: err.message });
    }
    req.Utilisateur = Utilisateur as UtilisateurPayload;
    next();
  });
}
