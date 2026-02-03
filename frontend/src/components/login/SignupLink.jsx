import React from 'react';

export default function SignupLink({ showSuccess }) {
	return (
		<div className={`signup-link ${showSuccess ? 'hidden' : ''}`}>
			<p>
				Vous découvrez BloomFund ? <a href="/inscription">Inscrivez-vous</a>
			</p>
		</div>
	);
}