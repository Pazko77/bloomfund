import { useState, useEffect, useRef } from 'react';
import './Inscription.scss';
import Logo from '/BloomfundLogo.svg';
import api from '../../helpers/request/api';
import { FormUtils } from '../../helpers/formUtils/form-utils';

import SuccessMessage from '../../components/login/SuccessMessage';
import SignupForm from '../../components/Signup/SignupForm';
import SocialLogin from '../../components/login/SocialLogin';
import LoginLink from '../../components/Signup/LoginLink';

export default function Inscription() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		terms: false,
	});
	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		terms: '',
	});
	const [focusedField, setFocusedField] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [notification, setNotification] = useState(null);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const formRef = useRef(null);
	const firstNameRef = useRef(null);

	// Handle input changes
	const handleChange = e => {
		const { name, value, type, checked } = e.target;
		const newValue = type === 'checkbox' ? checked : value;
		setFormData(prev => ({
			...prev,
			[name]: newValue,
		}));
		// Calculate password strength
		if (name === 'password') {
			setPasswordStrength(FormUtils.calculatePasswordStrength(value));
		}
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
		switch (fieldName) {
			case 'firstName':
				result = FormUtils.validateName(value, 'Le prénom');
				break;
			case 'lastName':
				result = FormUtils.validateName(value, 'Le nom');
				break;
			case 'email':
				result = FormUtils.validateEmail(value);
				break;
			case 'password':
				result = FormUtils.validatePassword(value);
				break;
			case 'confirmPassword':
				result = FormUtils.validateConfirmPassword(value, formData.password);
				break;
			case 'terms':
				// result = FormUtils.validateTerms(formData.terms);
				break;
			default:
				return;
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
	// Handle social signup
	const handleSocialSignup = provider => {
		showNotification(`Inscription avec ${provider}...`, 'info');
	};
	const signup = async userData => {
		try {
			const response = await api.post(`/utilisateurs/register`, {
				prenom: userData.firstName,
				nom: userData.lastName,
				email: userData.email,
				mot_de_passe: userData.password,
			});
			return { success: true, data: response.data };
		} catch (error) {
			// Gérer les erreurs du serveur
			if (error.response) {
				// Erreur renvoyée par le serveur
				showNotification(error.response.data.message, 'error');
			} else {
				// Erreur réseau ou autre
				showNotification('Impossible de se connecter au serveur', 'error');
			}
			return { success: false };
		}
	};
	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault();
		if (isSubmitting) return;
		// Validate all fields
		const firstNameValidation = FormUtils.validateName(formData.firstName, 'Le prénom');
		const lastNameValidation = FormUtils.validateName(formData.lastName, 'Le nom');
		const emailValidation = FormUtils.validateEmail(formData.email);
		const passwordValidation = FormUtils.validatePassword(formData.password);
		const confirmPasswordValidation = FormUtils.validateConfirmPassword(formData.confirmPassword, formData.password);
		const termsValidation = FormUtils.validateTerms(formData.terms);
		const newErrors = {
			firstName: firstNameValidation.isValid ? '' : firstNameValidation.message,
			lastName: lastNameValidation.isValid ? '' : lastNameValidation.message,
			email: emailValidation.isValid ? '' : emailValidation.message,
			password: passwordValidation.isValid ? '' : passwordValidation.message,
			confirmPassword: confirmPasswordValidation.isValid ? '' : confirmPasswordValidation.message,
			terms: termsValidation.isValid ? '' : termsValidation.message,
		};
		setErrors(newErrors);
		const isValid = Object.values(newErrors).every(error => error === '');
		if (!isValid) {
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
			const result = await signup(formData);

			if (!result.success) {
				setIsSubmitting(false);
				return;
			}

			setShowSuccess(true);
			// Redirect après succès
			setTimeout(() => {
				window.location.href = '/connexion';
			}, 1500);
			// Simulate redirect
			setTimeout(() => {
				// Reset form after demo
				setShowSuccess(false);
				setFormData({
					firstName: '',
					lastName: '',
					email: '',
					password: '',
					confirmPassword: '',
					terms: false,
				});
				setErrors({
					firstName: '',
					lastName: '',
					email: '',
					password: '',
					confirmPassword: '',
					terms: '',
				});
				setPasswordStrength(0);
			}, 1000);
		} catch (error) {
			showNotification(error.response?.data?.message || "Échec de l'inscription. Veuillez réessayer.", 'error');
		} finally {
			setIsSubmitting(false);
		}
	};
	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Escape') {
				setErrors({
					firstName: '',
					lastName: '',
					email: '',
					password: '',
					confirmPassword: '',
					terms: '',
				});
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<div className="signup">
			<div className="signup-container">
				<div className="signup-card">
					<div className="signup-header">
						<img src={Logo} alt="BloomFund Logo" />
						<p>S'incrire</p>
					</div>
					{notification && <div className={`notification notification-${notification.type}`}>{notification.message}</div>}

					<SignupForm
						formRef={formRef}
						showSuccess={showSuccess}
						handleSubmit={handleSubmit}
						isSubmitting={isSubmitting}
						errors={errors}
						focusedField={focusedField}
						formData={formData}
						handleChange={handleChange}
						setFocusedField={setFocusedField}
						handleBlur={handleBlur}
						firstNameRef={firstNameRef}
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						showConfirmPassword={showConfirmPassword}
						setShowConfirmPassword={setShowConfirmPassword}
						passwordStrength={passwordStrength}
					/>

					<SocialLogin showSuccess={showSuccess} handleSocialLogin={handleSocialSignup} containerClass="social-signup" />

					<LoginLink showSuccess={showSuccess} />

					<SuccessMessage showSuccess={showSuccess} title="Inscription réussie !" message="Bienvenue sur BloomFund !" />
				</div>
			</div>
		</div>
	);
}
