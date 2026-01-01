import { useState, useEffect, useRef } from "react";
import axios from 'axios';

import './FormulaireCagnotte.scss';
import Logo from '/BloomfundLogo.svg';

export default function FormulaireCagnotte() {

    
    const [formData, setFormData] = useState({
			titre: '',
			description: '',
			objectif_financier: '',
			localisation: '',
			date_fin: '',
			categorie_id: '',
			porteur_id: 1, // À récupérer depuis le contexte utilisateur
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
		const [imagePreview, setImagePreview] = useState(null);

		const formRef = useRef(null);
		const titreRef = useRef(null);

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

		// Handle image upload
		const handleImageChange = e => {
			const file = e.target.files[0];
			if (file) {
				if (file.size > 5 * 1024 * 1024) {
					showNotification("L'image ne doit pas dépasser 5 MB", 'error');
					return;
				}

				const reader = new FileReader();
				reader.onloadend = () => {
					setImagePreview(reader.result);
					setFormData(prev => ({
						...prev,
						image_url: reader.result,
					}));
				};
				reader.readAsDataURL(file);
			}
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
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/projets`, projetData);
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
				const projetData = {
					titre: formData.titre,
					description: formData.description,
					objectif_financier: parseFloat(formData.objectif_financier),
					localisation: formData.localisation || undefined,
					date_fin: formData.date_fin ? new Date(formData.date_fin) : undefined,
					categorie_id: formData.categorie_id ? parseInt(formData.categorie_id) : undefined,
					porteur_id: formData.porteur_id,
					image_url: formData.image_url || undefined,
				};

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
						porteur_id: 1,
						image_url: '',
					});
					setImagePreview(null);
					setErrors({
						titre: '',
						description: '',
						objectif_financier: '',
						localisation: '',
						date_fin: '',
						categorie_id: '',
					});
					window.location.href = `/projet/${data.id}`;
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

		return (
			<div className="cagnotte">
				<div className="cagnotte-container">
					<div className="cagnotte-card">
						<div className="cagnotte-header">
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
							<div className={`form-group ${errors.localisation ? 'has-error' : ''}`}>
								<div className={`input-wrapper ${focusedField === 'localisation' ? 'focused' : ''}`}>
									<input
										type="text"
										id="localisation"
										name="localisation"
										value={formData.localisation}
										onChange={handleChange}
										onFocus={() => setFocusedField('localisation')}
										onBlur={() => handleBlur('localisation')}
										className={formData.localisation ? 'has-value' : ''}
									/>
									<label htmlFor="localisation">Localisation (optionnel)</label>
								</div>
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
									<label htmlFor="date_fin">Date de fin (optionnel)</label>
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
										<option value="1">Solidarité</option>
										<option value="2">Culture</option>
										<option value="3">Sport</option>
										<option value="4">Environnement</option>
										<option value="5">Éducation</option>
										<option value="6">Santé</option>
										<option value="7">Technologie</option>
										<option value="8">Autre</option>
									</select>
									<label htmlFor="categorie_id">Catégorie (optionnel)</label>
								</div>
								{errors.categorie_id && <span className="error-message show">{errors.categorie_id}</span>}
							</div>

							{/* Image Upload */}
							<div className="form-group">
								<div className="image-upload-wrapper">
									<label htmlFor="image_url" className="image-upload-label">
										{imagePreview ? (
											<div className="image-preview">
												<img src={imagePreview} alt="Preview" />
												<span className="change-image">Changer l'image</span>
											</div>
										) : (
											<div className="upload-placeholder">
												<span className="upload-icon">📷</span>
												<span className="upload-text">Ajouter une image</span>
												<span className="upload-hint">(optionnel, max 5 MB)</span>
											</div>
										)}
									</label>
									<input type="file" id="image_url" name="image_url" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
								</div>
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