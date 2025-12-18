import { Utilisateur , UtilisateurPayload} from '../models/Utilisateur.model';
import jwt from 'jsonwebtoken';


const SECRET_KEY: string = process.env.JWT_SECRET || 'supersecrety';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';

export function generateAccessToken(user: Utilisateur): string {
	const payload: UtilisateurPayload = {
		id: user.id,
		email: user.email,
	};
	return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
}

export function generateRefreshToken(user: Utilisateur) {
	return jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, { expiresIn: '7d' });
}
