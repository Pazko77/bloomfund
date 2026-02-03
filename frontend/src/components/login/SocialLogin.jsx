import React from 'react';

export default function SocialLogin({ showSuccess, handleSocialLogin, containerClass = "social-login" }) {
	return (
		<>
			<div className={`divider ${showSuccess ? 'hidden' : ''}`}>
				<span>ou</span>
			</div>

			<div className={`${containerClass} ${showSuccess ? 'hidden' : ''}`}>
				<button type="button" className="social-btn google-btn" onClick={() => handleSocialLogin('Google')}>
					<span className="social-icon google-icon"></span>
					Google
				</button>
			</div>
		</>
	);
}