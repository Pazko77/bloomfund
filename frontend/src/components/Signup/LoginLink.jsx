import React from 'react';

export default function LoginLink({ showSuccess }) {
	return (
		<div className={`login-link ${showSuccess ? 'hidden' : ''}`}>
			<p>
				Vous avez déjà un compte ? <a href="/connexion">Connectez-vous</a>
			</p>
		</div>
	);
}