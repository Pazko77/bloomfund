/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';

import './FormulaireCagnotte.scss';
import Logo from '/BloomfundLogo.svg';
import api from '../../helpers/request/api';
import { useAuth } from '../../hook/useAuth';
import { useNavigate } from 'react-router-dom';

export default function FormulaireCagnotte() {
	const userProfil = useAuth();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (userProfil.isLogged === false) {
			navigate('/connexion');
		}
	}, [userProfil.isLogged, navigate]);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await api.get(`/utilisateurs/profile`);
				setUser(response.data.Utilisateur);
			} catch (error) {
				console.error('Erreur lors de la récupération des données utilisateur :', error);
			}
		};

		fetchUserData();
	}, [userProfil]);

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.get(`/categories`);
				// console.log('Catégories récupérées :', response.data);
				setCategories(response.data);
			} catch (error) {
				console.error('Erreur lors de la récupération des catégories :', error);
			}
		};

		fetchCategories();
	}, []);

	const [formData, setFormData] = useState({
		titre: '',
		description: '',
		objectif_financier: '',
		localisation: '',
		date_fin: '',
		categorie_id: '',
		image_url: '',
	});

	const [errors, setErrors] = useState({
		titre: '',
		description: '',
		objectif_financier: '',
		localisation: '',
		date_fin: '',
		categorie_id: '',
	});

	const [focusedField, setFocusedField] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [notification, setNotification] = useState(null);
	const [imagePreviews, setImagePreviews] = useState([]);
	const [imageUrls, setImageUrls] = useState([]);

	// États pour la recherche de localisation
	const [locationSuggestions, setLocationSuggestions] = useState([]);
	const [isLocationOpen, setIsLocationOpen] = useState(false);
	const [isLocationLoading, setIsLocationLoading] = useState(false);
	const [locationSelectedIndex, setLocationSelectedIndex] = useState(-1);

	const formRef = useRef(null);
	const titreRef = useRef(null);
	const locationTimeoutRef = useRef(null);
	const locationRef = useRef(null);

	// Validation functions
	const validateTitre = titre => {
		if (!titre) {
			return { isValid: false, message: 'Le titre est requis' };
		}
		if (titre.length < 5) {
			return { isValid: false, message: 'Le titre doit contenir au moins 5 caractères' };
		}
		if (titre.length > 100) {
			return { isValid: false, message: 'Le titre ne doit pas dépasser 100 caractères' };
		}
		return { isValid: true, message: '' };
	};

	const validateDescription = description => {
		if (!description) {
			return { isValid: false, message: 'La description est requise' };
		}
		if (description.length < 20) {
			return { isValid: false, message: 'La description doit contenir au moins 20 caractères' };
		}
		if (description.length > 2000) {
			return { isValid: false, message: 'La description ne doit pas dépasser 2000 caractères' };
		}
		return { isValid: true, message: '' };
	};

	const validateObjectifFinancier = objectif => {
		if (!objectif) {
			return { isValid: false, message: "L'objectif financier est requis" };
		}
		const montant = parseFloat(objectif);
		if (isNaN(montant) || montant <= 0) {
			return { isValid: false, message: 'Le montant doit être positif' };
		}
		if (montant < 100) {
			return { isValid: false, message: 'Le montant minimum est de 100€' };
		}
		if (montant > 1000000) {
			return { isValid: false, message: 'Le montant maximum est de 1 000 000€' };
		}
		return { isValid: true, message: '' };
	};

	const validateLocalisation = localisation => {
		if (!localisation) {
			return { isValid: true, message: '' }; // Optionnel
		}
		if (localisation.length < 3) {
			return { isValid: false, message: 'La localisation doit contenir au moins 3 caractères' };
		}
		return { isValid: true, message: '' };
	};

	const validateDateFin = date => {
		if (!date) {
			return { isValid: true, message: '' }; // Optionnel
		}
		const selectedDate = new Date(date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (selectedDate < today) {
			return { isValid: false, message: 'La date doit être dans le futur' };
		}

		const maxDate = new Date();
		maxDate.setFullYear(maxDate.getFullYear() + 2);

		if (selectedDate > maxDate) {
			return { isValid: false, message: 'La date ne peut pas dépasser 2 ans' };
		}

		return { isValid: true, message: '' };
	};

	const validateCategorie = categorie => {
		if (!categorie) {
			return { isValid: true, message: '' }; // Optionnel
		}
		return { isValid: true, message: '' };
	};

	// Handle input changes
	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user types
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	// Handle adding image URL
	const handleAddImageUrl = () => {
		const url = formData.image_url.trim();
		if (!url) {
			showNotification('Veuillez entrer une URL', 'error');
			return;
		}
		if (imageUrls.length >= 5) {
			showNotification('Maximum 5 images autorisées', 'error');
			return;
		}
		// Vérifier si l'URL est valide
		if (!url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) && !url.startsWith('http')) {
			showNotification("URL d'image invalide", 'error');
			return;
		}
		setImageUrls(prev => [...prev, url]);
		setImagePreviews(prev => [...prev, url]);
		setFormData(prev => ({ ...prev, image_url: '' }));
		showNotification('Image ajoutée !', 'success');
	};

	// Supprimer une image
	const removeImage = index => {
		setImageUrls(prev => prev.filter((_, i) => i !== index));
		setImagePreviews(prev => prev.filter((_, i) => i !== index));
	};

	// Handle field blur (validation)
	const handleBlur = fieldName => {
		setFocusedField(null);

		const value = formData[fieldName];
		let result;

		switch (fieldName) {
			case 'titre':
				result = validateTitre(value);
				break;
			case 'description':
				result = validateDescription(value);
				break;
			case 'objectif_financier':
				result = validateObjectifFinancier(value);
				break;
			case 'localisation':
				result = validateLocalisation(value);
				break;
			case 'date_fin':
				result = validateDateFin(value);
				break;
			case 'categorie_id':
				result = validateCategorie(value);
				break;
			default:
				result = { isValid: true, message: '' };
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

	const creerProjet = async projetData => {
		const response = await api.post(`/projets`, projetData);
		return response.data;
	};

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault();

		if (isSubmitting) return;

		// Validate all fields
		const titreValidation = validateTitre(formData.titre);
		const descriptionValidation = validateDescription(formData.description);
		const objectifValidation = validateObjectifFinancier(formData.objectif_financier);
		const localisationValidation = validateLocalisation(formData.localisation);
		const dateFinValidation = validateDateFin(formData.date_fin);
		const categorieValidation = validateCategorie(formData.categorie_id);

		const newErrors = {
			titre: titreValidation.isValid ? '' : titreValidation.message,
			description: descriptionValidation.isValid ? '' : descriptionValidation.message,
			objectif_financier: objectifValidation.isValid ? '' : objectifValidation.message,
			localisation: localisationValidation.isValid ? '' : localisationValidation.message,
			date_fin: dateFinValidation.isValid ? '' : dateFinValidation.message,
			categorie_id: categorieValidation.isValid ? '' : categorieValidation.message,
		};

		setErrors(newErrors);

		if (
			!titreValidation.isValid ||
			!descriptionValidation.isValid ||
			!objectifValidation.isValid ||
			!localisationValidation.isValid ||
			!dateFinValidation.isValid ||
			!categorieValidation.isValid
		) {
			// Shake form on error
			if (formRef.current) {
				formRef.current.style.animation = 'shake 0.5s ease-in-out';
				setTimeout(() => {
					if (formRef.current) formRef.current.style.animation = '';
				}, 500);
			}
			showNotification('Veuillez corriger les erreurs du formulaire', 'error');
			return;
		}

		// Submit form
		setIsSubmitting(true);

		try {
			const finalImageUrls = imageUrls.length > 0 ? imageUrls : ['https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg'];

			const projetData = {
				titre: formData.titre,
				description: formData.description,
				objectif_financier: parseFloat(formData.objectif_financier),
				localisation: formData.localisation || undefined,
				date_fin: formData.date_fin ? new Date(formData.date_fin) : undefined,
				categorie_id: formData.categorie_id ? parseInt(formData.categorie_id) : undefined,
				image_url: JSON.stringify(finalImageUrls),
			};

			console.log('Données du projet à envoyer :', projetData);
			console.log(projetData.image_url);

			const data = await creerProjet(projetData);

			setShowSuccess(true);
			showNotification('Cagnotte créée avec succès !', 'success');

			// Simulate redirect
			setTimeout(() => {
				// Reset form after demo
				setShowSuccess(false);
				setFormData({
					titre: '',
					description: '',
					objectif_financier: '',
					localisation: '',
					date_fin: '',
					categorie_id: '',
					image_url: '',
				});
				setImageUrls([]);
				setImagePreviews([]);
				setErrors({
					titre: '',
					description: '',
					objectif_financier: '',
					localisation: '',
					date_fin: '',
					categorie_id: '',
				});
				window.location.href = `/cagnotte/${data.id}`;
			}, 2000);
		} catch (error) {
			showNotification(error.response?.data?.message || 'Échec de la création', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Escape') {
				setErrors({
					titre: '',
					description: '',
					objectif_financier: '',
					localisation: '',
					date_fin: '',
					categorie_id: '',
				});
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

	// Auto-focus titre on page visibility
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible' && !formData.titre) {
				setTimeout(() => titreRef.current?.focus(), 100);
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, [formData.titre]);

	// Recherche de localisation (départements uniquement)
	useEffect(() => {
		if (formData.localisation.length < 2) {
			setLocationSuggestions([]);
			setIsLocationOpen(false);
			return;
		}

		setIsLocationLoading(true);
		clearTimeout(locationTimeoutRef.current);

		locationTimeoutRef.current = setTimeout(async () => {
			try {
				const departements = await fetch(`https://geo.api.gouv.fr/departements?nom=${encodeURIComponent(formData.localisation)}&limit=8`).then(r =>
					r.json()
				);

				const formattedSuggestions = departements.map(d => ({
					type: 'departement',
					code: d.code,
					nom: d.nom,
					displayValue: `${d.nom} (${d.code})`,
				}));

				setLocationSuggestions(formattedSuggestions);
				setIsLocationOpen(formattedSuggestions.length > 0);
				setLocationSelectedIndex(-1);
			} catch (error) {
				console.error('Erreur lors de la récupération des suggestions:', error);
				setLocationSuggestions([]);
			} finally {
				setIsLocationLoading(false);
			}
		}, 400);

		return () => clearTimeout(locationTimeoutRef.current);
	}, [formData.localisation]);

	// Fermer les suggestions au clic extérieur
	useEffect(() => {
		const handleClickOutside = e => {
			if (locationRef.current && !locationRef.current.contains(e.target)) {
				setIsLocationOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLocationSelect = suggestion => {
		setFormData(prev => ({ ...prev, localisation: suggestion.displayValue }));
		setIsLocationOpen(false);
		setLocationSuggestions([]);
	};

	const handleLocationKeyDown = e => {
		if (!isLocationOpen || locationSuggestions.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setLocationSelectedIndex(prev => (prev < locationSuggestions.length - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setLocationSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Enter':
				e.preventDefault();
				if (locationSelectedIndex >= 0) {
					handleLocationSelect(locationSuggestions[locationSelectedIndex]);
				}
				break;
			case 'Escape':
				setIsLocationOpen(false);
				setLocationSelectedIndex(-1);
				break;
			default:
				break;
		}
	};

	return (
		<div className="formulaire-cagnotte">
			<div className="formulaire-cagnotte-container">
				<div className="formulaire-cagnotte-card">
					<div className="formulaire-cagnotte-header">
						<img src={Logo} alt="BloomFund Logo" />
						<h2>Créer une cagnotte</h2>
						<p>Donnez vie à votre projet</p>
					</div>

					{notification && <div className={`notification notification-${notification.type}`}>{notification.message}</div>}

					<form ref={formRef} className={`cagnotte-form ${showSuccess ? 'form-hidden' : ''}`} id="cagnotteForm" onSubmit={handleSubmit} noValidate>
						{/* Titre */}
						<div className={`form-group ${errors.titre ? 'has-error' : ''}`}>
							<div className={`input-wrapper ${focusedField === 'titre' ? 'focused' : ''}`}>
								<input
									ref={titreRef}
									type="text"
									id="titre"
									name="titre"
									value={formData.titre}
									onChange={handleChange}
									onFocus={() => setFocusedField('titre')}
									onBlur={() => handleBlur('titre')}
									className={formData.titre ? 'has-value' : ''}
									required
								/>
								<label htmlFor="titre">Titre de la cagnotte</label>
							</div>
							{errors.titre && <span className="error-message show">{errors.titre}</span>}
						</div>

						{/* Description */}
						<div className={`form-group ${errors.description ? 'has-error' : ''}`}>
							<div className={`input-wrapper textarea-wrapper ${focusedField === 'description' ? 'focused' : ''}`}>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleChange}
									onFocus={() => setFocusedField('description')}
									onBlur={() => handleBlur('description')}
									className={formData.description ? 'has-value' : ''}
									rows="5"
									required
								/>
								<label htmlFor="description">Description du projet</label>
								<span className="char-count">{formData.description.length}/2000</span>
							</div>
							{errors.description && <span className="error-message show">{errors.description}</span>}
						</div>

						{/* Objectif Financier */}
						<div className={`form-group ${errors.objectif_financier ? 'has-error' : ''}`}>
							<div className={`input-wrapper ${focusedField === 'objectif_financier' ? 'focused' : ''}`}>
								<input
									type="number"
									id="objectif_financier"
									name="objectif_financier"
									value={formData.objectif_financier}
									onChange={handleChange}
									onFocus={() => setFocusedField('objectif_financier')}
									onBlur={() => handleBlur('objectif_financier')}
									className={formData.objectif_financier ? 'has-value' : ''}
									min="100"
									max="1000000"
									step="1"
									required
								/>
								<label htmlFor="objectif_financier">Objectif financier (€)</label>
								<span className="currency-symbol">€</span>
							</div>
							{errors.objectif_financier && <span className="error-message show">{errors.objectif_financier}</span>}
						</div>

						{/* Localisation */}
						<div className={`form-group ${errors.localisation ? 'has-error' : ''}`} ref={locationRef}>
							<div className={`input-wrapper ${focusedField === 'localisation' ? 'focused' : ''}`} style={{ position: 'relative' }}>
								<input
									type="text"
									id="localisation"
									name="localisation"
									value={formData.localisation}
									onChange={handleChange}
									onFocus={() => {
										setFocusedField('localisation');
										if (locationSuggestions.length > 0) setIsLocationOpen(true);
									}}
									onBlur={() => handleBlur('localisation')}
									onKeyDown={handleLocationKeyDown}
									className={formData.localisation ? 'has-value' : ''}
									autoComplete="off"
								/>
								<label htmlFor="localisation">Département (optionnel)</label>
								{isLocationLoading && (
									<div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
										<div className="btn-loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
									</div>
								)}
							</div>
							{isLocationOpen && locationSuggestions.length > 0 && (
								<div
									style={{
										position: 'absolute',
										zIndex: 1000,
										width: '100%',
										maxHeight: '200px',
										overflowY: 'auto',
										background: 'white',
										border: '1px solid #e5e7eb',
										borderRadius: '8px',
										boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
										marginTop: '4px',
									}}>
									{locationSuggestions.map((suggestion, index) => (
										<div
											key={`${suggestion.type}-${suggestion.code}`}
											onClick={() => handleLocationSelect(suggestion)}
											onMouseEnter={() => setLocationSelectedIndex(index)}
											style={{
												padding: '10px 12px',
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												background: index === locationSelectedIndex ? '#f3f4f6' : 'white',
											}}>
											<span>{suggestion.displayValue}</span>
										</div>
									))}
								</div>
							)}
							{errors.localisation && <span className="error-message show">{errors.localisation}</span>}
						</div>

						{/* Date de fin */}
						<div className={`form-group ${errors.date_fin ? 'has-error' : ''}`}>
							<div className={`input-wrapper ${focusedField === 'date_fin' ? 'focused' : ''}`}>
								<input
									type="date"
									id="date_fin"
									name="date_fin"
									value={formData.date_fin}
									onChange={handleChange}
									onFocus={() => setFocusedField('date_fin')}
									onBlur={() => handleBlur('date_fin')}
									className={formData.date_fin ? 'has-value' : ''}
									min={new Date().toISOString().split('T')[0]}
								/>
								<label htmlFor="date_fin">Date de fin </label>
							</div>
							{errors.date_fin && <span className="error-message show">{errors.date_fin}</span>}
						</div>

						{/* Catégorie */}
						<div className={`form-group ${errors.categorie_id ? 'has-error' : ''}`}>
							<div className={`input-wrapper select-wrapper ${focusedField === 'categorie_id' ? 'focused' : ''}`}>
								<select
									id="categorie_id"
									name="categorie_id"
									value={formData.categorie_id}
									onChange={handleChange}
									onFocus={() => setFocusedField('categorie_id')}
									onBlur={() => handleBlur('categorie_id')}
									className={formData.categorie_id ? 'has-value' : ''}>
									<option value="">Sélectionner </option>
									{/* <option value="1">Solidarité</option>
									<option value="2">Culture</option>
									<option value="3">Sport</option>
									<option value="4">Environnement</option>
									<option value="5">Éducation</option>
									<option value="6">Santé</option>
									<option value="7">Technologie</option>
									<option value="8">Autre</option> */}
									{categories.map(categorie => (
										<option key={categorie.id} value={categorie.id}>
											{categorie.nom}
										</option>
									))}
								</select>
								<label htmlFor="categorie_id">Catégorie </label>
							</div>
							{errors.categorie_id && <span className="error-message show">{errors.categorie_id}</span>}
						</div>

						{/* Image Upload */}
						<div className="form-group">
							<label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
								Images ({imagePreviews.length}/5)
							</label>

							{/* Images Preview Grid */}
							{imagePreviews.length > 0 && (
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
										gap: '10px',
										marginBottom: '15px',
									}}>
									{imagePreviews.map((preview, index) => (
										<div
											key={index}
											style={{
												position: 'relative',
												aspectRatio: '1',
												borderRadius: '8px',
												overflow: 'hidden',
												border: '2px solid #e5e7eb',
											}}>
											<img
												src={preview}
												alt={`Preview ${index + 1}`}
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
												onError={e => {
													e.target.src = 'https://via.placeholder.com/100?text=Erreur';
												}}
											/>
											<button
												type="button"
												onClick={() => removeImage(index)}
												style={{
													position: 'absolute',
													top: '4px',
													right: '4px',
													width: '24px',
													height: '24px',
													borderRadius: '50%',
													background: 'rgba(239, 68, 68, 0.9)',
													color: 'white',
													border: 'none',
													cursor: 'pointer',
													fontSize: '16px',
													lineHeight: '1',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}>
												×
											</button>
											{index === 0 && (
												<span
													style={{
														position: 'absolute',
														bottom: '4px',
														left: '4px',
														background: '#15a019',
														color: 'white',
														fontSize: '10px',
														padding: '2px 6px',
														borderRadius: '4px',
													}}>
													Principal
												</span>
											)}
										</div>
									))}
								</div>
							)}

							{/* Add Image URL Input */}
							{imagePreviews.length < 5 && (
								<div style={{ display: 'flex', gap: '10px' }}>
									<div className={`input-wrapper ${focusedField === 'image_url' ? 'focused' : ''}`} style={{ flex: 1 }}>
										<input
											type="text"
											id="image_url"
											name="image_url"
											value={formData.image_url}
											onChange={handleChange}
											onFocus={() => setFocusedField('image_url')}
											onBlur={() => setFocusedField(null)}
											onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
											className={formData.image_url ? 'has-value' : ''}
											placeholder="https://exemple.com/image.jpg"
										/>
										<label htmlFor="image_url">URL de l'image</label>
									</div>
									<button
										type="button"
										onClick={handleAddImageUrl}
										style={{
											padding: '12px 20px',
											background: '#15a019',
											color: 'white',
											border: 'none',
											borderRadius: '8px',
											cursor: 'pointer',
											fontWeight: '500',
										}}>
										+ Ajouter
									</button>
								</div>
							)}
						</div>

						<button type="submit" className={`cagnotte-btn btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
							<span className="btn-text">Créer la cagnotte</span>
							<span className="btn-loader"></span>
						</button>
					</form>

					<div className={`success-message ${showSuccess ? 'show' : ''}`} id="successMessage">
						<div className="success-icon">✓</div>
						<h3>Cagnotte créée avec succès !</h3>
						<p>Redirection vers votre projet...</p>
					</div>
				</div>
			</div>
		</div>
	);
}
