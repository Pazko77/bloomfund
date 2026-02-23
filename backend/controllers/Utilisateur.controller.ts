import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from '../common/generateToken';
import { hashP } from '../common/hashPassword';
import { UtilisateurService } from './../services/Utilisateur.service';
import bcrypt from 'bcrypt';
import { Utilisateur, UtilisateurInput } from './../models/Utilisateur.model';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
import axios from 'axios';

export const UtilisateurController = {
	// REGISTER
	async register(req: Request, res: Response) {
		const UtilisateurCurrent: UtilisateurInput = req.body;
		// Hash the password
		UtilisateurCurrent.mot_de_passe = await hashP(UtilisateurCurrent.mot_de_passe);

		const existing = await UtilisateurService.findByEmail(UtilisateurCurrent.email);
		if (existing) {
			return res.status(400).json({ message: 'Utilisateur déjà existant', success: false });
		}

		const newUtilisateur = await UtilisateurService.create(UtilisateurCurrent);

		if (!newUtilisateur) {
			return res.status(500).json({
				message: "Erreur lors de la création de l'utilisateur.",
				success: false,
			});
		}
		return res.json({ message: 'Utilisateur cree !', success: true });
	},

	// LOGIN
	async login(req: Request, res: Response) {
		const UtilisateurCurrent: UtilisateurInput = req.body;
		const existingUtilisateur = await UtilisateurService.findByEmail(UtilisateurCurrent.email);

		if (!existingUtilisateur) {
			return res.status(400).json({ message: 'Utilisateur non trouvé', success: false });
		}

		// Vérifie le mot de passe
		const isPasswordValid = await bcrypt.compare(UtilisateurCurrent.mot_de_passe, existingUtilisateur.mot_de_passe);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Mot de passe incorrect', success: false });
		}

		// Génère les tokens
		const token = generateAccessToken(existingUtilisateur);
		const refreshToken = generateRefreshToken(existingUtilisateur);

		// Stocke le refresh token en base de données pour cet utilisateur
		await UtilisateurService.update(existingUtilisateur.id, { refresh_token: refreshToken });
		// Envoie le refresh token en httpOnly cookie (ou dans le body si tu préfères)
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax', // 'lax' est nécessaire pour le cross-port (5173 -> 8080)
			path: '/',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax', // 'lax' est nécessaire pour le cross-port (5173 -> 8080)
			path: '/',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
		});

		return res.json({ token: token, success: true });
	},

	// REFRESH TOKEN
	async refreshToken(req: Request, res: Response) {
		try {
			// Récupère le refresh token depuis le cookie ou le body
			const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

			// console.log('[RefreshToken] Received refresh token:', refreshToken);

			if (!refreshToken) {
				return res.status(401).json({ message: 'Refresh token manquant', success: false });
			}
			// Vérifie le refresh token
			const decoded = (jwt as any).verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'supersecrety');
			// Vérifie qu'il correspond à celui stocké en base
			const user = await UtilisateurService.findById(decoded.id);

			// console.log('[RefreshToken] Token valid for user ID:', user, refreshToken);

			if (!user || user.refresh_token !== refreshToken) {
				return res.status(403).json({ message: 'Refresh token invalide correspondant à un utilisateur différent', success: false });
			}
			// Génère un nouveau token d'accès
			const token = generateAccessToken(user as Utilisateur);
			const newRefreshToken = generateRefreshToken(user as Utilisateur);

			await UtilisateurService.update(user.id, { refresh_token: newRefreshToken });
			res.cookie('refreshToken', newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax', // 'lax' est nécessaire pour le cross-port (5173 -> 8080)
				path: '/',
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			res.cookie('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				path: '/',
				maxAge: 30 * 60 * 1000,
				sameSite: 'lax',
			});

			return res.json({ success: true });
		} catch (err) {
			return res.status(403).json({ message: 'Refresh token invalide', success: false });
		}
	},

	// LOGOUT
	async logout(req: Request, res: Response) {
		res.clearCookie('token');
		res.clearCookie('refreshToken');
		return res.json({ success: true });
	},

	// ROUTE PROTÉGÉE
	async profile(req: Request, res: Response) {
		return res.json({ Utilisateur: req.Utilisateur });
	},

	// UPDATE PROFILE
	async updateProfile(req: Request, res: Response) {
		const userId = req.Utilisateur?.id;
		const { nom, prenom, email, departement } = req.body;

		if (!userId) {
			return res.status(401).json({ message: 'Non autorisé', success: false });
		}

		// Vérifier si l'email est déjà utilisé par un autre utilisateur
		if (email) {
			const existingUser = await UtilisateurService.findByEmail(email);
			if (existingUser && existingUser.id !== userId) {
				return res.status(400).json({ message: 'Cet email est déjà utilisé', success: false });
			}
		}

		const updated = await UtilisateurService.update(userId, {
			nom,
			prenom,
			email,
			departement,
		});

		if (!updated) {
			return res.status(500).json({
				message: 'Erreur lors de la modification du profil',
				success: false,
			});
		}

		return res.json({
			message: 'Profil modifié avec succès',
			success: true,
		});
	},

	// CHANGE PASSWORD
	async changePassword(req: Request, res: Response) {
		const { ancienMotDePasse, nouveauMotDePasse, email } = req.body;
		const userId = req.Utilisateur?.id;

		if (!ancienMotDePasse || !nouveauMotDePasse) {
			return res.status(400).json({
				message: 'Ancien et nouveau mot de passe requis',
				success: false,
			});
		}

		if (nouveauMotDePasse.length < 6) {
			return res.status(400).json({
				message: 'Le mot de passe doit contenir au moins 6 caractères',
				success: false,
			});
		}
		let utilisateur = null;

		if (userId === null) {
			utilisateur = await UtilisateurService.findByEmail(email);
		} else {
			utilisateur = await UtilisateurService.findById(userId ?? 0);
		}

		if (!utilisateur) {
			return res.status(404).json({ message: 'Utilisateur non trouvé', success: false });
		}

		const isPasswordValid = await bcrypt.compare(ancienMotDePasse, utilisateur.mot_de_passe);

		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Ancien mot de passe incorrect', success: false });
		}

		const hashedPassword = await hashP(nouveauMotDePasse);
		const updated = await UtilisateurService.update(userId ?? 0, {
			mot_de_passe: hashedPassword,
		});

		if (!updated) {
			return res.status(500).json({
				message: 'Erreur lors de la modification du mot de passe',
				success: false,
			});
		}

		return res.json({
			message: 'Mot de passe modifié avec succès',
			success: true,
		});
	},

	//Google Social Login
	async googleLogin(req: Request, res: Response) {
		try {
			const { token } = req.body; 

			const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: { Authorization: `Bearer ${token}` },
			});

			const payload = googleRes.data;

			if (!payload || !payload.email) {
				return res.status(400).json({ message: 'Token Google invalide ou expiré', success: false });
			}

			let user = await UtilisateurService.findByEmail(payload.email);

			if (!user) {
				const newUser: UtilisateurInput = {
					nom: payload.family_name || '',
					prenom: payload.given_name || '',
					email: payload.email,
					mot_de_passe: await hashP(Math.random().toString(36).slice(-10)),
					departement: '',
					role: 'citoyen' ,
				};
				user = await UtilisateurService.create(newUser);
			}

			const accessToken = generateAccessToken(user as Utilisateur);
			const refreshToken = generateRefreshToken(user as Utilisateur);

			await UtilisateurService.update((user as Utilisateur).id, { refresh_token: refreshToken });

			const isProd = process.env.NODE_ENV === 'production';

			res.cookie('token', accessToken, {
				httpOnly: true,
				secure: isProd,
				sameSite: 'lax',
				path: '/',
				maxAge: 30 * 60 * 1000,
			});

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: isProd,
				sameSite: 'lax',
				path: '/',
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			console.log('Login Google réussi pour :', payload.email);
			return res.json({ token: accessToken, success: true });
		} catch (error: any) {
			console.error('Erreur Google Login :', error.response?.data || error.message);
			return res.status(500).json({
				message: 'Erreur lors de la connexion avec Google',
				success: false,
			});
		}
	},
	// GET ALL USERS
	async getAll(req: Request, res: Response) {
		try {
			const utilisateurs = await UtilisateurService.getAll();
			return res.json(utilisateurs);
		} catch (error) {
			console.error('Erreur getAll utilisateurs :', error);
			return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', success: false });
		}
	},
};
