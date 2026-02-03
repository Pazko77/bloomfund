import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
import { parseImages } from '../../helpers/image/parseImg.js';
import api from '../../helpers/request/api.js';
import { Collecte } from './collecte/Collecte.jsx';
import { Contrepartie } from './contreparties/Contrepartie.jsx';
import { Contribution } from './contributions/Contribution.jsx';
import { Commentaire } from './commentaires/Commentaire.jsx';
import { FormUtils } from '../../helpers/formUtils/form-utils';


export function TabNavigation({ projet, contributions }) {
	// console.log('TabNavigation props:', { projet, contributions });
	const [commentaires, setCommentaires] = useState([]);

	// ----------------------- --------------------------------------------------
	// Gestion des Collect
	// --------------------------------------------------------------------------
	const [activeTab, setActiveTab] = useState('collecte');
	// const [activeTab, setActiveTab] = useState('commentaires');

	const tabs = [
		{ id: 'collecte', label: 'Collecte' },
		{ id: 'contreparties', label: 'Contreparties' },
		{ id: 'contributions', label: `Contributions ${contributions.length ?? 0} ` },
		{ id: 'commentaires', label: `Commentaires ${commentaires.length ?? 0}` },
	];

	const images = parseImages(projet);

	// images.push(...test);

	const [currentIndex, setCurrentIndex] = useState(0);

	// console.log('Images for slider:', currentIndex);

	const nextImage = () => {
		setCurrentIndex(prev => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const [showAll, setShowAll] = useState(false); // pour gérer le bouton "Voir plus"

	const visibleContributions = showAll ? contributions : contributions.slice(0, 5);

	const borderClass = index => (index === visibleContributions.length - 1 ? 'border-b-2' : '');

	// ----------------------- --------------------------------------------------
	// Formulaire de connexion et gestion des commentaires
	// --------------------------------------------------------------------------

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
			// eslint-disable-next-line no-unused-vars
			const data = await login(formData.email, formData.password);

			setShowSuccess(true);
			// Simulate redirect
			setTimeout(() => {
				// Reset form after demo
				setShowSuccess(false);
				setFormData({ email: '', password: '', remember: false });
				setErrors({ email: '', password: '' });
				setIsLoggedIn(true);
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

	useEffect(() => {
		const token = localStorage.getItem('token');
		setIsLoggedIn(!!token);
	}, []);

	const [isLoggedIn, setIsLoggedIn] = useState(false); // récupérer vrai état depuis ton auth
	const [commentText, setCommentText] = useState('');

	function isTokenExpired(token) {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const now = Date.now() / 1000; // en secondes
			return payload.exp < now;
		} catch (e) {
			console.error('Erreur lors de la vérification du token :', e);
			return true;
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token || isTokenExpired(token)) {
			localStorage.removeItem('token');
			setIsLoggedIn(false);
		} else {
			setIsLoggedIn(true);
		}
	}, []);

	const handleCommentSubmit = async e => {
		e.preventDefault();
		if (!commentText.trim()) return;

		const token = localStorage.getItem('token');

		if (!token || isTokenExpired(token)) {
			localStorage.removeItem('token');
			setIsLoggedIn(false);
			showNotification('Session expirée, veuillez vous reconnecter', 'error');
			return;
		}

		try {
			const currentUserResponse = await api.get(`/utilisateurs/profile`);

			const currentUser = currentUserResponse.data;
			// console.log('Current User:', currentUser.Utilisateur.id);

			await api.post(`/commentaires`, {
				projet_id: projet.projet_id,
				contenu: commentText,
				utilisateur_id: currentUser.Utilisateur.id,
			});

			setCommentText('');
			showNotification('Commentaire ajouté !', 'success');
		} catch (err) {
			console.error(err);
			showNotification("Erreur lors de l'envoi du commentaire", 'error');
		}
	};

	useEffect(() => {
		const fetchCommentaires = async () => {
			try {
				const response = await api.get(`/commentaires/projet/${projet.projet_id}`);

				let commentaires = response.data.commentaires.map(c => ({
					name: `${c.prenom.toLowerCase()}-${c.nom.toLowerCase()}`,
					comment: c.contenu,
					date: timeAgo(c.date_commentaire),
					avatar: `${c.prenom[0]}${c.nom[0]}`.toUpperCase(),
				}));
				setCommentaires(commentaires);
				// console.log('Commentaires fetched:', response.data);s
			} catch (error) {
				console.error('Erreur lors de la récupération des commentaires :', error);
			}
		};
		if (projet?.projet_id) {
			fetchCommentaires();
		}
	}, [projet.projet_id]);

	function timeAgo(dateString) {
		const now = new Date();
		const date = new Date(dateString);
		const diffMs = now - date;

		const minutes = Math.floor(diffMs / (1000 * 60));
		const hours = Math.floor(diffMs / (1000 * 60 * 60));
		const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const months = Math.floor(days / 30);

		if (minutes < 60) return `Il y a ${minutes} min`;
		if (hours < 24) return `Il y a ${hours} heures`;
		if (days < 30) return `Il y a ${days} jours`;
		return `Il y a ${months} mois`;
	}

	const renderContent = () => {
		switch (activeTab) {
			case 'collecte':
				return <Collecte projet={projet} images={images} prevImage={prevImage} nextImage={nextImage} currentIndex={currentIndex} />;
			case 'contreparties':
				return <Contrepartie />;
			case 'contributions':
				return (
					<Contribution
						contributions={contributions}
						visibleContributions={visibleContributions}
						timeAgo={timeAgo}
						borderClass={borderClass}
						showAll={showAll}
						setShowAll={setShowAll}
					/>
				);
			case 'commentaires':
				return (
					<Commentaire
						commentaires={commentaires}
						isLoggedIn={isLoggedIn}
						handleCommentSubmit={handleCommentSubmit}
						commentText={commentText}
						setCommentText={setCommentText}
						notification={notification}
						formData={formData}
						handleChange={handleChange}
						handleSubmit={handleSubmit}
						errors={errors}
						focusedField={focusedField}
						setFocusedField={setFocusedField}
						handleBlur={handleBlur}
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						isSubmitting={isSubmitting}
						showSuccess={showSuccess}
						handleForgotPassword={handleForgotPassword}
						formRef={formRef}
						emailRef={emailRef}
						passwordRef={passwordRef}
					/>
				);
		}
	};

	return (
		<div className="w-full flex flex-col  items-center ">
			{/* Navigation Tabs */}
			<div className="border-b border-gray-200 w-full ">
				<nav className="flex gap-8 w-full justify-start  px-80">
					{tabs.map(tab => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`relative pb-4 transition-colors ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
							{tab.label}
							{activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
						</button>
					))}
				</nav>
			</div>

			{/* Content Area */}
			<div className="w-full flex flex-row py-10  px-80 gap-15">
				<div className=" w-3/4 flex  ">{renderContent()}</div>
				{/* <div className="w-1/4 flex flex-col items-center justify-start">
					<div className="w-80 h-40 border-2 border-[#b8afa4] flex items-center justify-center flex-col gap-4 ">
						<p className="text-center">Soutenez la collecte et recevez des contreparties en échange.</p>
						<a href="#" className="upper border-2 border-[#4c9a4e] px-10 py-4 inline-block text-center   ">
							Voir les Contreparties
						</a>
					</div>
				</div> */}
			</div>
		</div>
	);
}
