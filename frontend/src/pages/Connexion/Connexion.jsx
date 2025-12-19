import { useState, useEffect, useRef } from 'react';
import './Connexion.scss';
import Logo from '/backgroundLogo.svg';

export default function Connexion() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		remember: false,
	});

	const [errors, setErrors] = useState({
		email: '',
		password: '',
	});

	const [focusedField, setFocusedField] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [notification, setNotification] = useState(null);

	const formRef = useRef(null);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	// Validation functions
	const validateEmail = email => {
		if (!email) {
			return { isValid: false, message: "L'email est requis" };
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return { isValid: false, message: 'Email invalide' };
		}
		return { isValid: true, message: '' };
	};

	const validatePassword = password => {
		if (!password) {
			return { isValid: false, message: 'Le mot de passe est requis' };
		}
		if (password.length < 6) {
			return { isValid: false, message: 'Au moins 6 caractères requis' };
		}
		return { isValid: true, message: '' };
	};

	// Handle input changes
	const handleChange = e => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));

		// Clear error when user types
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	// Handle field blur (validation)
	const handleBlur = fieldName => {
		setFocusedField(null);

		const value = formData[fieldName];
		let result;

		if (fieldName === 'email') {
			result = validateEmail(value);
		} else if (fieldName === 'password') {
			result = validatePassword(value);
		}

		if (result && !result.isValid) {
			setErrors(prev => ({ ...prev, [fieldName]: result.message }));
		} else if (result && result.isValid) {
			setErrors(prev => ({ ...prev, [fieldName]: '' }));
		}
	};

	// Show notification
	const showNotification = (message, type = 'info') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 3000);
	};

	// Handle social login
	const handleSocialLogin = provider => {
		showNotification(`Connexion avec ${provider}...`, 'info');
	};

	// Handle forgot password
	const handleForgotPassword = e => {
		e.preventDefault();
		showNotification('Le lien de réinitialisation serait envoyé à votre email', 'info');
	};

	// Simulate login API call
	const simulateLogin = async (email, password) => {
		return new Promise(resolve => {
			setTimeout(() => {
				console.log('Login attempt:', { email, password });
				resolve({ success: true });
			}, 1500);
		});
	};

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault();

		if (isSubmitting) return;

		// Validate all fields
		const emailValidation = validateEmail(formData.email);
		const passwordValidation = validatePassword(formData.password);

		const newErrors = {
			email: emailValidation.isValid ? '' : emailValidation.message,
			password: passwordValidation.isValid ? '' : passwordValidation.message,
		};

		setErrors(newErrors);

		if (!emailValidation.isValid || !passwordValidation.isValid) {
			// Shake form on error
			if (formRef.current) {
				formRef.current.style.animation = 'shake 0.5s ease-in-out';
				setTimeout(() => {
					if (formRef.current) formRef.current.style.animation = '';
				}, 500);
			}
			return;
		}

		// Submit form
		setIsSubmitting(true);

		try {
			await simulateLogin(formData.email, formData.password);
			setShowSuccess(true);

			// Simulate redirect
			setTimeout(() => {
				// Reset form after demo
				setShowSuccess(false);
				setFormData({ email: '', password: '', remember: false });
				setErrors({ email: '', password: '' });
			}, 5000);
		} catch (error) {
			showNotification('Échec de la connexion. Veuillez réessayer.', error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Escape') {
				setErrors({ email: '', password: '' });
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

	// Auto-focus email on page visibility
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible' && !formData.email) {
				setTimeout(() => emailRef.current?.focus(), 100);
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, [formData.email]);

	return (
		<div className="login">
			<div className="login-container">
				<div className="login-card">
					<div className="login-header">
						<img src={Logo} alt="BloomFund Logo" />
						<p>Se connecter</p>
					</div>

					{notification && <div className={`notification notification-${notification.type}`}>{notification.message}</div>}

					<form ref={formRef} className={`login-form ${showSuccess ? 'form-hidden' : ''}`} id="loginForm" onSubmit={handleSubmit} noValidate>
						<div className={`form-group ${errors.email ? 'has-error' : ''}`}>
							<div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''}`}>
								<input
									ref={emailRef}
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									onFocus={() => setFocusedField('email')}
									onBlur={() => handleBlur('email')}
									className={formData.email ? 'has-value' : ''}
									required
									autoComplete="email"
								/>
								<label htmlFor="email">Adresse Mail</label>
							</div>
							{errors.email && <span className="error-message show">{errors.email}</span>}
						</div>

						<div className={`form-group ${errors.password ? 'has-error' : ''}`}>
							<div className={`input-wrapper password-wrapper ${focusedField === 'password' ? 'focused' : ''}`}>
								<input
									ref={passwordRef}
									type={showPassword ? 'text' : 'password'}
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									onFocus={() => setFocusedField('password')}
									onBlur={() => handleBlur('password')}
									className={formData.password ? 'has-value' : ''}
									required
									autoComplete="current-password"
								/>
								<label htmlFor="password">Mot de Passe</label>
								<button
									type="button"
									className="password-toggle"
									onClick={() => setShowPassword(!showPassword)}
									aria-label="Toggle password visibility">
									<span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
								</button>
							</div>
							{errors.password && <span className="error-message show">{errors.password}</span>}
						</div>

						<div className="form-options">
							<label className="remember-wrapper">
								<input type="checkbox" id="remember" name="remember" checked={formData.remember} onChange={handleChange} />
								<span className="checkbox-label">
									<span className="checkmark"></span>
									Souviens-toi de moi
								</span>
							</label>
							<a href="#" className="forgot-password" onClick={handleForgotPassword}>
								Mot de passe oublié ?
							</a>
						</div>

						<button type="submit" className={`login-btn btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
							<span className="btn-text">Se connecter</span>
							<span className="btn-loader"></span>
						</button>
					</form>

					<div className={`divider ${showSuccess ? 'hidden' : ''}`}>
						<span>ou</span>
					</div>

					<div className={`social-login ${showSuccess ? 'hidden' : ''}`}>
						<button type="button" className="social-btn google-btn" onClick={() => handleSocialLogin('Google')}>
							<span className="social-icon google-icon"></span>
							Google
						</button>
						<button type="button" className="social-btn github-btn" onClick={() => handleSocialLogin('Facebook')}>
							<span className="social-icon facebook-icon"></span>
							Facebook
						</button>
					</div>

					<div className={`signup-link ${showSuccess ? 'hidden' : ''}`}>
						<p>
							Vous découvrez BloomFund ? <a href="/inscription">Inscrivez-vous</a>
						</p>
					</div>

					<div className={`success-message ${showSuccess ? 'show' : ''}`} id="successMessage">
						<div className="success-icon">✓</div>
						<h3>Connexion réussie !</h3>
						<p>Redirection vers votre tableau de bord...</p>
					</div>
				</div>
			</div>
		</div>
	);
}
