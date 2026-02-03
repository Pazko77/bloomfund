import { useState, useEffect, useRef } from "react";
import './Connexion.scss';
import Logo from '/BloomfundLogo.svg';
import api from "../../helpers/request/api";
import LoginForm from '../../components/login/LoginForm';
import SocialLogin from '../../components/login/SocialLogin';
import SignupLink from '../../components/login/SignupLink';
import SuccessMessage from '../../components/login/SuccessMessage';
import { FormUtils } from '../../helpers/formUtils/form-utils';


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
			result = FormUtils.validateEmail(value);
		} else if (fieldName === 'password') {
			result = FormUtils.validatePassword(value);
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

	const login = async (email, password) => {
		const response = await api.post(`/utilisateurs/login`, {
			email,
			mot_de_passe: password,
		});

		return response.data;
	};

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault();

		if (isSubmitting) return;

		// Validate all fields
		const emailValidation = FormUtils.validateEmail(formData.email);
		const passwordValidation = FormUtils.validatePassword(formData.password);

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
			const data = await login(formData.email, formData.password);

			localStorage.setItem('token', data.token);

			setShowSuccess(true);
			// Simulate redirect
			setTimeout(() => {
				// Reset form after demo
				setShowSuccess(false);
				setFormData({ email: '', password: '', remember: false });
				setErrors({ email: '', password: '' });
				window.location.href = '/rechercher';
			}, 1000);
		} catch (error) {
			showNotification(error.response?.data?.message || 'Échec de la connexion', 'error');
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

					<LoginForm
						formRef={formRef}
						handleSubmit={handleSubmit}
						showSuccess={showSuccess}
						errors={errors}
						focusedField={focusedField}
						formData={formData}
						handleChange={handleChange}
						setFocusedField={setFocusedField}
						handleBlur={handleBlur}
						emailRef={emailRef}
						passwordRef={passwordRef}
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						handleForgotPassword={handleForgotPassword}
						isSubmitting={isSubmitting}
					/>

					<SocialLogin showSuccess={showSuccess} handleSocialLogin={handleSocialLogin} />

					<SignupLink showSuccess={showSuccess} />

					<SuccessMessage showSuccess={showSuccess} />
				</div>
			</div>
		</div>
	);
}
