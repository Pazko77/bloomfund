import React from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import api from '../../helpers/request/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth';

export default function SocialLogin({ showSuccess, handleSocialLogin, containerClass = 'social-login' }) {
	const navigate = useNavigate();
	const userProfil = useAuth();

	const login = useGoogleLogin({
		onSuccess: async tokenResponse => {
			try {
				const res = await api.post('/utilisateurs/google-login', {
					token: tokenResponse.access_token,
				});

				if (res.data.success) {
					userProfil.refreshUser();
					navigate('/rechercher');
				}
			} catch (error) {
				console.error('Erreur backend Google:', error);
				handleSocialLogin('Error API');
			}
		},
		onError: () => handleSocialLogin('Error Google Login'),
	});

	return (
		<>
			<div className={`divider ${showSuccess ? 'hidden' : ''}`}>
				<span>ou</span>
			</div>
			<div className="flex items-center justify-center w-full my-5">
				<div className={`${containerClass} ${showSuccess ? 'hidden' : ''}`}>
					<button
						type="button"
						className="social-btn google-btn flex items-center"
						onClick={() => login()} // Déclenche le login
					>
						<span className="social-icon google-icon mr-2"></span>
						Continuer avec Google
					</button>
				</div>
			</div>
		</>
	);
}