import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
export function TabNavigation({ projet, contributions }) {
	// console.log('TabNavigation props:', { projet, contributions });
	const [commentaires, setCommentaires] = useState([]);

	// ----------------------- --------------------------------------------------
	// Gestion des Collect
	// --------------------------------------------------------------------------
	// const [activeTab, setActiveTab] = useState('collecte');
	const [activeTab, setActiveTab] = useState('commentaires');

	const tabs = [
		{ id: 'collecte', label: 'Collecte' },
		{ id: 'contreparties', label: 'Contreparties' },
		{ id: 'contributions', label: `Contributions ${contributions.length ?? 0} ` },
		{ id: 'commentaires', label: `Commentaires ${commentaires.length ?? 0}` },
	];

	const test = ['https://picsum.photos/800/400?1', 'https://picsum.photos/800/400?2'];

	const images = projet?.images?.length ? projet.images : projet?.image_url ? [projet.image_url] : [];

	images.push(...test);

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

	// Handle forgot password
	const handleForgotPassword = e => {
		e.preventDefault();
		showNotification('Le lien de réinitialisation serait envoyé à votre email', 'info');
	};

	const login = async (email, password) => {
		const response = await axios.post(`${import.meta.env.VITE_API_URL}/utilisateurs/login`, {
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
			const data = await login(formData.email, formData.password);

			if (formData.remember) {
				localStorage.setItem('token', data.token);
			}

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
			const currentUserResponse = await axios.get(`${import.meta.env.VITE_API_URL}/utilisateurs/profile`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const currentUser = currentUserResponse.data;
			// console.log('Current User:', currentUser.Utilisateur.id);

			await axios.post(
				`${import.meta.env.VITE_API_URL}/commentaires`,
				{
					projet_id: projet.projet_id,
					contenu: commentText,
					utilisateur_id: currentUser.Utilisateur.id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

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
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/commentaires/projet/${projet.projet_id}`);

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
				return (
					<div className="">
						<h2 className="text-2xl">A propos de cette collecte</h2>
						<div className="my-6 flex flex-col ">
							{/* SLIDER */}
							<div className="relative w-5/6 h-96 overflow-hidden  bg-black">
								<img src={images[currentIndex]} alt="Projet" className="w-full h-full object-cover transition-opacity duration-500" />

								{/* Boutons */}
								<button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full">
									←
								</button>

								<button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full">
									→
								</button>
							</div>
						</div>

						<div className=" w-5/6  ">
							<p className="text-left">{projet.description}</p>
						</div>
					</div>
				);
			case 'contreparties':
				return (
					<div className="bg-amber-500">
						<h2 className="text-2xl">Contreparties</h2>
						<div className="my-6 flex flex-col "></div>
					</div>
				);
			case 'contributions':
				return (
					<div className="w-full ">
						<h2 className="text-2xl">{contributions.length} Contributions</h2>

						<div className="my-6 flex flex-col  w-full">
							{visibleContributions.map((contribution, index) => {
								return (
									<div
										key={index}
										className={`border-r-2 border-t-2  border-l-2  border-gray-300 py-4 flex flex-row justify-between  ${borderClass(index)}`}>
										<div className="flex flex-row items-center  w-3/4">
											<img src="/shared/icon-contribution.svg" alt="icon-contribution" />
											<p>
												<span className="font-medium text-[#4c9a4e]">
													{contribution.prenom} {contribution.nom}
												</span>{' '}
												a contribué par un don de <span className="font-medium text-[#4c9a4e]">{contribution.montant.split('.')[0]}€</span>
											</p>
										</div>
										<div className="flex items-center justify-end w-1/4 mr-10">
											<p>Environ {timeAgo(contribution.date_contribution)}</p>
										</div>
									</div>
								);
							})}
						</div>

						{contributions.length > 5 && (
							<div className="flex justify-center mt-4">
								<button
									className="upper border-2 border-[#4c9a4e] text-[#4c9a4e] px-10 py-4 inline-block text-center   "
									onClick={() => setShowAll(!showAll)}>
									{showAll ? 'Voir moins' : 'Voir plus'}
								</button>
							</div>
						)}
					</div>
				);
			case 'commentaires':
				return (
					<div className="space-y-6">
						<h2 className="text-2xl mb-6">Commentaires</h2>

						{/* Formulaire de connexion pour commenter */}
						<div className="bg-white border border-gray-200 p-8 rounded-lg">
							{/* 

							 */}
							{notification && <div className={`notification notification-${notification.type}`}>{notification.message}</div>}
							{isLoggedIn ? (
								<>
									<h3 className="text-center text-lg mb-6">laisser un commentaire</h3>
									<form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
										<textarea
											name="comment"
											value={commentText}
											onChange={e => setCommentText(e.target.value)}
											placeholder="Votre commentaire..."
											className="border border-gray-300 rounded-lg p-2 w-full"
											required
										/>
										<button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
											Envoyer
										</button>
									</form>
								</>
							) : (
								<>
									<h3 className="text-center text-lg mb-2">Vous devez être connecté pour</h3>
									<h3 className="text-center text-lg mb-6">laisser un commentaire</h3>
									<p className="text-center text-sm text-gray-600 mb-6">Pour continuer, saisissez votre e-mail ou connectez-vous</p>
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
								</>
							)}
						</div>

						{/* Liste des commentaires */}
						<div className="space-y-6 mt-8">
							{[
								...commentaires,

								{
									name: 'serge-hunkley',
									comment: 'Bravo, vous avez tout mon soutien !',
									date: 'Il y a 3 heures',
									avatar: 'SH',
								},
								{
									name: 'nael-joel',
									comment:
										'Félicitations pour une aussi belle aventure, votre talent est indéniable, je vous souhaite plein de belles choses ce soir. 🎊 😍 💝  Avec tout mon soutien et amitié. 🎊 🎊 🎊',
									date: 'Il y a 1 jour',
									avatar: 'NJ',
								},
								{
									name: 'marine-grimaudet',
									comment: 'Bravo pour cette belle initiative !',
									date: 'Il y a 2 jours',
									avatar: 'MG',
								},
							].map((comment, index) => (
								<div key={index} className="border-b border-gray-100 pb-6">
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold shrink-0 text-sm">
											{comment.avatar}
										</div>
										<div className="flex-1">
											<div className="mb-2">
												<p className="font-semibold text-gray-900">{comment.name}</p>
											</div>
											<p className="text-gray-700 mb-2">{comment.comment}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
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
				<div className=" w-3/4 flex  items-center">{renderContent()}</div>
				<div className="w-1/4 flex flex-col items-center justify-start">
					<div className="w-80 h-40 border-2 border-[#b8afa4] flex items-center justify-center flex-col gap-4 ">
						<p className="text-center">Soutenez la collecte et recevez des contreparties en échange.</p>
						<a href="#" className="upper border-2 border-[#4c9a4e] px-10 py-4 inline-block text-center   ">
							Voir les Contreparties
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
