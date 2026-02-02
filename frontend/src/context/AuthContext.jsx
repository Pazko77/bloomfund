
import { AuthContext } from './AuthContext.js';
import { useState, useEffect } from 'react';
import api from '../helpers/request/api';

export function AuthProvider({ children }) {
	const [userCtx, setUserCtx] = useState(null);

	// Vérifie l'état de connexion au montage
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get(`/utilisateurs/profile`);
				setUserCtx(response.data.Utilisateur);
				/* eslint-disable no-unused-vars */
			} catch (error) {
				setUserCtx(null);
				// console.warn('Utilisateur non connecté' + error);
			}
		};
		fetchUser();
	}, []);

	const refreshUser = async () => {
		try {
			const response = await api.get(`/utilisateurs/profile`);
			setUserCtx(response.data.Utilisateur);
		} catch {
			setUserCtx(null);
		}
	};

	const isLogged = !!userCtx;

	return <AuthContext.Provider value={{ userCtx, setUserCtx, refreshUser, isLogged }}>{children}</AuthContext.Provider>;
}
 