
// import { AuthContext } from './AuthContext.js';
// import { useState, useEffect } from 'react';
// import api from '../helpers/request/api';

// export function AuthProvider({ children }) {
// 	const [userCtx, setUserCtx] = useState(null);
// 	const [loading, setLoading] = useState(true);

// 	// Vérifie l'état de connexion au montage
// 	useEffect(() => {
// 		const fetchUser = async () => {
// 			try {
// 				const response = await api.get(`${import.meta.env.VITE_API_URL}/utilisateurs/profile`);
// 				setUserCtx(response.data.Utilisateur);
// 			} catch (error) {
// 				setUserCtx(null);
// 				console.warn('Utilisateur non connecté' + error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		fetchUser();
// 	}, []);

// 	const refreshUser = async () => {
// 		setLoading(true);
// 		try {
// 			const response = await api.get(`${import.meta.env.VITE_API_URL}/utilisateurs/profile`);
// 			setUserCtx(response.data);
// 		} catch {
// 			setUserCtx(null);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

//     return <AuthContext.Provider value={{ userCtx, setUserCtx, refreshUser, loading }}>{children}</AuthContext.Provider>;
// }
 