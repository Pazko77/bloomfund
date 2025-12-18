import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UtilisateurPayload } from '../models/Utilisateur.model';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecret';

// console.log('SECRET_KEY:', SECRET_KEY);
/**
 *
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {*}
 */
// export function authenticateToken(req: Request, res: Response, next: NextFunction) {
// 	const authHeader = req.headers['authorization'];
// 	const token = authHeader && authHeader.split(' ')[1]; // format "Bearer TOKEN"
// 	if (!token) return res.sendStatus(401);

// 	jwt.verify(token, SECRET_KEY, (err: any, Utilisateur: any) => {
// 		if (err) return res.sendStatus(403);
// 		req.Utilisateur = Utilisateur as UtilisateurPayload;
// 		next();
// 	});
// }

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader?.split(' ')[1]; //format "Bearer TOKEN"

	if (!token) return res.status(401).json({ message: 'Token manquant' });

	try {
		const decoded = jwt.verify(token, SECRET_KEY) as UtilisateurPayload;
		req.Utilisateur = decoded; // Stocke le payload dans req.Utilisateur
		next();
	} catch (err) {
		return res.status(403).json({ message: 'Token invalide ou expiré' });
	}
};