
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UtilisateurPayload } from '../models/Utilisateur.model';
import dotenv from 'dotenv';
dotenv.config();

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
	
	let token = req.cookies?.token;
    if (!token) {
		token = req.headers.authorization?.split(' ')[1];

    }
	try {
		const secret = process.env.JWT_SECRET || '';
		const payload = jwt.verify(token, secret) as UtilisateurPayload;
		if (payload.role !== 'admin') {
			return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
		}
		req.Utilisateur = payload;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Token invalide ou expiré' });
	}
}
