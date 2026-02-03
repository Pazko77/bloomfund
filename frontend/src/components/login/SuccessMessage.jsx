import React from 'react';

export default function SuccessMessage({ showSuccess, title = 'Connexion réussie !', message = 'Redirection vers votre tableau de bord...' }) {
	return (
		<div className={`success-message ${showSuccess ? 'show' : ''}`} id="successMessage">
			<div className="success-icon">✓</div>
			<h3>{title}</h3>
			<p>{message}</p>
		</div>
	);
}
