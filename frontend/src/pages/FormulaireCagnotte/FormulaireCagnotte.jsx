/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import './FormulaireCagnotte.scss';
import Logo from '/BloomfundLogo.svg';
import api from '../../helpers/request/api';
import { useAuth } from '../../hook/useAuth';
import { useNavigate } from 'react-router-dom';
import { encodeId, decodeId } from '../../helpers/encoder/hashId';

export default function FormulaireCagnotte({ edit = false }) {
	const [formData, setFormData] = useState({
		titre: '',
		description: '',
		objectif_financier: '',
		localisation: '',
		date_fin: '',
		categorie_id: '',
		image_url: '',
	});

	const userProfil = useAuth();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [projetId, setProjetId] = useState(null);

	useEffect(() => {
		if (edit) {
			const id = decodeId(window.location.pathname.split('/cagnotte/')[1]?.split('/edit')[0] || '');
			setProjetId(id);

			const fetchProjetData = async () => {
				try {
					const response = await api.get(`/projets/${id}`);
					const projet = response.data;

					if (userProfil.userCtx.role === 'admin') {
						// Admins can edit any project, no redirection needed
					} else {
						if (projet.utilisateur_id !== userProfil.userCtx.id) {
							navigate('/profil');
							return;
						}
					}
					setFormData({
						titre: projet.titre,
						description: projet.description,
						objectif_financier: projet.objectif_financier,
						localisation: projet.localisation || '',
						date_fin: projet.date_fin ? projet.date_fin.split('T')[0] : '',
						categorie_id: projet.categorie_id || '',
						image_url: '',
					});

					if (projet.image_url) {
						const images = JSON.parse(projet.image_url);
						setImageUrls(images);
						setImagePreviews(images);
					}

					// Charger les contreparties existantes
					const contrepartiesResponse = await api.get(`/contreparties/projet/${id}`);
					setContrepartiesExistantes(contrepartiesResponse.data || []);
				} catch (error) {
					console.error('Erreur lors de la récupération des données du projet :', error);
				}
			};

			fetchProjetData();
		}
	}, [edit, navigate, userProfil.userCtx.id, userProfil.userCtx.role]);

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

	// États pour les contreparties
	const [contreparties, setContreparties] = useState([]); // Nouvelles contreparties (pas encore en base)
	const [contrepartiesExistantes, setContrepartiesExistantes] = useState([]); // Contreparties déjà en base
	const [contrepartiesToDelete, setContrepartiesToDelete] = useState([]); // IDs des contreparties à supprimer
	const [editingContrepartieId, setEditingContrepartieId] = useState(null); // ID de la contrepartie en cours d'édition
	const [contrepartieForm, setContrepartieForm] = useState({
		titre: '',
		description: '',
		montant_minimum: '',
		type: 'physique',
		quantite_disponible: '',
		date_livraison_estimee: '',
		image_url: '',
	});
	const [showContrepartieForm, setShowContrepartieForm] = useState(false);

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

	const modifierProjet = async (id, projetData) => {
		const response = await api.put(`/projets/${id}`, projetData);
		return response.data;
	};

	// Fonctions pour gérer les contreparties
	const handleContrepartieChange = e => {
		const { name, value } = e.target;
		setContrepartieForm(prev => ({ ...prev, [name]: value }));
	};

	const handleAddContrepartie = () => {
		if (!contrepartieForm.titre || !contrepartieForm.description || !contrepartieForm.montant_minimum) {
			showNotification('Veuillez remplir les champs obligatoires de la contrepartie', 'error');
			return;
		}
		if (parseFloat(contrepartieForm.montant_minimum) <= 0) {
			showNotification('Le montant minimum doit être positif', 'error');
			return;
		}
		setContreparties(prev => [...prev, { ...contrepartieForm, id: Date.now() }]);
		setContrepartieForm({
			titre: '',
			description: '',
			montant_minimum: '',
			type: 'physique',
			quantite_disponible: '',
			date_livraison_estimee: '',
			image_url: '',
		});
		setShowContrepartieForm(false);
		showNotification('Contrepartie ajoutée !', 'success');
	};

	const removeContrepartie = id => {
		setContreparties(prev => prev.filter(c => c.id !== id));
	};

	const removeContrepartieExistante = id => {
		setContrepartiesToDelete(prev => [...prev, id]);
		setContrepartiesExistantes(prev => prev.filter(c => c.id !== id));
	};

	const editContrepartieExistante = contrepartie => {
		setEditingContrepartieId(contrepartie.id);
		setContrepartieForm({
			titre: contrepartie.titre,
			description: contrepartie.description,
			montant_minimum: contrepartie.montant_minimum.toString(),
			type: contrepartie.type || 'physique',
			quantite_disponible: contrepartie.quantite_disponible?.toString() || '',
			date_livraison_estimee: contrepartie.date_livraison_estimee ? contrepartie.date_livraison_estimee.split('T')[0] : '',
			image_url: contrepartie.image_url || '',
		});
		setShowContrepartieForm(true);
	};

	const handleSaveContrepartie = () => {
		if (!contrepartieForm.titre || !contrepartieForm.description || !contrepartieForm.montant_minimum) {
			showNotification('Veuillez remplir les champs obligatoires de la contrepartie', 'error');
			return;
		}
		if (parseFloat(contrepartieForm.montant_minimum) <= 0) {
			showNotification('Le montant minimum doit être positif', 'error');
			return;
		}

		if (editingContrepartieId) {
			// Mise à jour d'une contrepartie existante
			setContrepartiesExistantes(prev =>
				prev.map(c =>
					c.id === editingContrepartieId
						? { ...c, ...contrepartieForm, montant_minimum: parseFloat(contrepartieForm.montant_minimum), _modified: true }
						: c
				)
			);
			showNotification('Contrepartie modifiée !', 'success');
		} else {
			// Ajout d'une nouvelle contrepartie
			setContreparties(prev => [...prev, { ...contrepartieForm, id: Date.now() }]);
			showNotification('Contrepartie ajoutée !', 'success');
		}

		setContrepartieForm({
			titre: '',
			description: '',
			montant_minimum: '',
			type: 'physique',
			quantite_disponible: '',
			date_livraison_estimee: '',
			image_url: '',
		});
		setShowContrepartieForm(false);
		setEditingContrepartieId(null);
	};

	const cancelEditContrepartie = () => {
		setContrepartieForm({
			titre: '',
			description: '',
			montant_minimum: '',
			type: 'physique',
			quantite_disponible: '',
			date_livraison_estimee: '',
			image_url: '',
		});
		setShowContrepartieForm(false);
		setEditingContrepartieId(null);
	};

	const creerContrepartie = async (projet_id, contrepartie) => {
		// Exclure l'id temporaire et ne garder que les champs nécessaires
		const contrepartieData = {
			titre: contrepartie.titre,
			description: contrepartie.description,
			montant_minimum: parseFloat(contrepartie.montant_minimum),
			type: contrepartie.type || 'physique',
			projet_id,
			quantite_disponible: contrepartie.quantite_disponible ? parseInt(contrepartie.quantite_disponible) : undefined,
			date_livraison_estimee: contrepartie.date_livraison_estimee || undefined,
			image_url: contrepartie.image_url || undefined,
		};
		console.log('Envoi contrepartie:', contrepartieData);
		const response = await api.post('/contreparties', contrepartieData);
		console.log('Contrepartie créée :', response.data);
		return response.data;
	};

	const modifierContrepartie = async (id, projet_id, contrepartie) => {
		const contrepartieData = {
			titre: contrepartie.titre,
			description: contrepartie.description,
			montant_minimum: parseFloat(contrepartie.montant_minimum),
			type: contrepartie.type || 'physique',
			projet_id,
			quantite_disponible: contrepartie.quantite_disponible ? parseInt(contrepartie.quantite_disponible) : undefined,
			date_livraison_estimee: contrepartie.date_livraison_estimee || undefined,
			image_url: contrepartie.image_url || undefined,
		};
		const response = await api.put(`/contreparties/${id}`, contrepartieData);
		return response.data;
	};

	const supprimerContrepartie = async (id, projet_id) => {
		const response = await api.delete(`/contreparties/${id}?projet_id=${projet_id}`);
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

			let data;
			if (edit && projetId) {
				data = await modifierProjet(projetId, projetData);

				// Supprimer les contreparties marquées à supprimer
				for (const contrepartieId of contrepartiesToDelete) {
					try {
						await supprimerContrepartie(contrepartieId, projetId);
					} catch (err) {
						console.error('Erreur suppression contrepartie:', err);
					}
				}

				// Mettre à jour les contreparties modifiées
				for (const contrepartie of contrepartiesExistantes.filter(c => c._modified)) {
					try {
						await modifierContrepartie(contrepartie.id, projetId, contrepartie);
					} catch (err) {
						console.error('Erreur modification contrepartie:', err);
					}
				}

				// Créer les nouvelles contreparties
				for (const contrepartie of contreparties) {
					try {
						await creerContrepartie(projetId, contrepartie);
					} catch (err) {
						console.error('Erreur création contrepartie:', err);
					}
				}

				setShowSuccess(true);
				showNotification('Cagnotte modifiée avec succès !', 'success');
			} else {
				data = await creerProjet(projetData);

				// Créer les contreparties pour ce projet
				if (contreparties.length > 0) {
					for (const contrepartie of contreparties) {
						try {
							await creerContrepartie(data.id, contrepartie);
						} catch (err) {
							console.error('Erreur création contrepartie:', err);
						}
					}
				}

				setShowSuccess(true);
				showNotification('Cagnotte créée avec succès !', 'success');
			}

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
				window.location.href = `/cagnotte/${edit ? encodeId(projetId) : encodeId(data.id)}`;
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
						<h2>{edit ? 'Modifier la cagnotte' : 'Créer une cagnotte'}</h2>
						<p>{edit ? 'Modifiez les informations de votre projet' : 'Donnez vie à votre projet'}</p>
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
								<label htmlFor="localisation">Département </label>
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

						{/* Section Contreparties */}
						<div className="form-group" style={{ marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
								<label className="form-label" style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>
									Contreparties ({contrepartiesExistantes.length + contreparties.length})
								</label>
								<button
									type="button"
									onClick={() => {
										if (showContrepartieForm) {
											cancelEditContrepartie();
										} else {
											setShowContrepartieForm(true);
										}
									}}
									style={{
										padding: '8px 16px',
										background: showContrepartieForm ? '#ef4444' : '#15a019',
										color: 'white',
										border: 'none',
										borderRadius: '8px',
										cursor: 'pointer',
										fontWeight: '500',
										fontSize: '14px',
									}}>
									{showContrepartieForm ? 'Annuler' : '+ Ajouter une contrepartie'}
								</button>
							</div>

							{/* Liste des contreparties existantes (en base) */}
							{edit && contrepartiesExistantes.length > 0 && (
								<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
									<p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>Contreparties existantes :</p>
									{contrepartiesExistantes.map(c => (
										<div
											key={c.id}
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												padding: '12px 15px',
												background: c._modified ? '#fef3c7' : '#f9fafb',
												borderRadius: '8px',
												border: c._modified ? '1px solid #f59e0b' : '1px solid #e5e7eb',
											}}>
											<div>
												<span style={{ fontWeight: '600', color: '#1f2937' }}>{c.titre}</span>
												<span style={{ margin: '0 10px', color: '#9ca3af' }}>|</span>
												<span style={{ color: '#15a019', fontWeight: '500' }}>{c.montant_minimum}€ min</span>
												<span style={{ margin: '0 10px', color: '#9ca3af' }}>|</span>
												<span
													style={{
														padding: '2px 8px',
														borderRadius: '4px',
														fontSize: '12px',
														background: c.type === 'physique' ? '#dbeafe' : '#fef3c7',
														color: c.type === 'physique' ? '#1d4ed8' : '#b45309',
													}}>
													{c.type === 'physique' ? 'Physique' : 'En ligne'}
												</span>
												{c._modified && (
													<span
														style={{
															marginLeft: '10px',
															padding: '2px 8px',
															borderRadius: '4px',
															fontSize: '12px',
															background: '#fef3c7',
															color: '#b45309',
														}}>
														Modifié
													</span>
												)}
											</div>
											<div style={{ display: 'flex', gap: '8px' }}>
												<button
													type="button"
													onClick={() => editContrepartieExistante(c)}
													style={{
														padding: '4px 10px',
														background: '#dbeafe',
														color: '#1d4ed8',
														border: 'none',
														borderRadius: '4px',
														cursor: 'pointer',
														fontSize: '12px',
													}}>
													Modifier
												</button>
												<button
													type="button"
													onClick={() => removeContrepartieExistante(c.id)}
													style={{
														padding: '4px 10px',
														background: '#fee2e2',
														color: '#dc2626',
														border: 'none',
														borderRadius: '4px',
														cursor: 'pointer',
														fontSize: '12px',
													}}>
													Supprimer
												</button>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Liste des nouvelles contreparties (pas encore en base) */}
							{contreparties.length > 0 && (
								<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
									{edit && <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>Nouvelles contreparties :</p>}
									{contreparties.map(c => (
										<div
											key={c.id}
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												padding: '12px 15px',
												background: '#ecfdf5',
												borderRadius: '8px',
												border: '1px solid #10b981',
											}}>
											<div>
												<span style={{ fontWeight: '600', color: '#1f2937' }}>{c.titre}</span>
												<span style={{ margin: '0 10px', color: '#9ca3af' }}>|</span>
												<span style={{ color: '#15a019', fontWeight: '500' }}>{c.montant_minimum}€ min</span>
												<span style={{ margin: '0 10px', color: '#9ca3af' }}>|</span>
												<span
													style={{
														padding: '2px 8px',
														borderRadius: '4px',
														fontSize: '12px',
														background: c.type === 'physique' ? '#dbeafe' : '#fef3c7',
														color: c.type === 'physique' ? '#1d4ed8' : '#b45309',
													}}>
													{c.type === 'physique' ? 'Physique' : 'En ligne'}
												</span>
												{edit && (
													<span
														style={{
															marginLeft: '10px',
															padding: '2px 8px',
															borderRadius: '4px',
															fontSize: '12px',
															background: '#ecfdf5',
															color: '#10b981',
														}}>
														Nouveau
													</span>
												)}
											</div>
											<button
												type="button"
												onClick={() => removeContrepartie(c.id)}
												style={{
													padding: '4px 10px',
													background: '#fee2e2',
													color: '#dc2626',
													border: 'none',
													borderRadius: '4px',
													cursor: 'pointer',
													fontSize: '12px',
												}}>
												Supprimer
											</button>
										</div>
									))}
								</div>
							)}

							{/* Formulaire d'ajout/modification de contrepartie */}
							{showContrepartieForm && (
								<div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
									{editingContrepartieId && (
										<p style={{ marginBottom: '15px', fontWeight: '600', color: '#1d4ed8' }}>Modification de la contrepartie</p>
									)}
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
										<div className={`input-wrapper ${focusedField === 'contrepartie_titre' ? 'focused' : ''}`}>
											<input
												type="text"
												name="titre"
												value={contrepartieForm.titre}
												onChange={handleContrepartieChange}
												onFocus={() => setFocusedField('contrepartie_titre')}
												onBlur={() => setFocusedField(null)}
												className={contrepartieForm.titre ? 'has-value' : ''}
												required
											/>
											<label>Titre *</label>
										</div>
										<div className={`input-wrapper ${focusedField === 'contrepartie_montant' ? 'focused' : ''}`}>
											<input
												type="number"
												name="montant_minimum"
												value={contrepartieForm.montant_minimum}
												onChange={handleContrepartieChange}
												onFocus={() => setFocusedField('contrepartie_montant')}
												onBlur={() => setFocusedField(null)}
												className={contrepartieForm.montant_minimum ? 'has-value' : ''}
												min="1"
												required
											/>
											<label>Montant minimum (€) *</label>
										</div>
									</div>
									<div
										className={`input-wrapper textarea-wrapper ${focusedField === 'contrepartie_desc' ? 'focused' : ''}`}
										style={{ marginTop: '15px' }}>
										<textarea
											name="description"
											value={contrepartieForm.description}
											onChange={handleContrepartieChange}
											onFocus={() => setFocusedField('contrepartie_desc')}
											onBlur={() => setFocusedField(null)}
											className={contrepartieForm.description ? 'has-value' : ''}
											rows="3"
											required
										/>
										<label>Description *</label>
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
										<div className={`input-wrapper select-wrapper ${focusedField === 'contrepartie_type' ? 'focused' : ''}`}>
											<select
												name="type"
												value={contrepartieForm.type}
												onChange={handleContrepartieChange}
												onFocus={() => setFocusedField('contrepartie_type')}
												onBlur={() => setFocusedField(null)}
												className="has-value">
												<option value="physique">Physique (livraison)</option>
												<option value="en_ligne">En ligne (numérique)</option>
											</select>
											<label>Type</label>
										</div>
										<div className={`input-wrapper ${focusedField === 'contrepartie_quantite' ? 'focused' : ''}`}>
											<input
												type="number"
												name="quantite_disponible"
												value={contrepartieForm.quantite_disponible}
												onChange={handleContrepartieChange}
												onFocus={() => setFocusedField('contrepartie_quantite')}
												onBlur={() => setFocusedField(null)}
												className={contrepartieForm.quantite_disponible ? 'has-value' : ''}
												min="1"
												placeholder=" "
											/>
											<label>Quantité disponible</label>
										</div>
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
										<div className={`input-wrapper ${focusedField === 'contrepartie_date' ? 'focused' : ''}`}>
											<input
												type="date"
												name="date_livraison_estimee"
												value={contrepartieForm.date_livraison_estimee}
												onChange={handleContrepartieChange}
												onFocus={() => setFocusedField('contrepartie_date')}
												onBlur={() => setFocusedField(null)}
												className={contrepartieForm.date_livraison_estimee ? 'has-value' : ''}
											/>
											<label>Date de livraison estimée</label>
										</div>
										<div className={`input-wrapper ${focusedField === 'contrepartie_image' ? 'focused' : ''}`}>
											<input
												type="text"
												name="image_url"
												value={contrepartieForm.image_url}
												onChange={handleContrepartieChange}
												onFocus={() => setFocusedField('contrepartie_image')}
												onBlur={() => setFocusedField(null)}
												className={contrepartieForm.image_url ? 'has-value' : ''}
												placeholder="https://..."
											/>
											<label>URL de l'image</label>
										</div>
									</div>
									<button
										type="button"
										onClick={handleSaveContrepartie}
										style={{
											marginTop: '15px',
											padding: '10px 20px',
											background: editingContrepartieId ? '#1d4ed8' : '#15a019',
											color: 'white',
											border: 'none',
											borderRadius: '8px',
											cursor: 'pointer',
											fontWeight: '500',
											width: '100%',
										}}>
										{editingContrepartieId ? 'Enregistrer les modifications' : 'Ajouter cette contrepartie'}
									</button>
								</div>
							)}
						</div>

						<button type="submit" className={`cagnotte-btn btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
							<span className="btn-text">{edit ? 'Modifier la cagnotte' : 'Créer la cagnotte'}</span>

							<span className="btn-loader"></span>
						</button>
						{edit && (
							<button
								type="button"
								className={`mt-4  cancel-btn ${isSubmitting ? 'loading' : ''}`}
								onClick={() => navigate(`/cagnotte/${encodeId(projetId)}`)}
								disabled={isSubmitting}>
								<span className="btn-text">Annuler</span>
							</button>
						)}
					</form>

					<div className={`success-message ${showSuccess ? 'show' : ''}`} id="successMessage">
						<div className="success-icon">✓</div>
						<h3>{edit ? 'Cagnotte modifiée avec succès !' : 'Cagnotte créée avec succès !'}</h3>
						<p>Redirection vers votre projet...</p>
					</div>
				</div>
			</div>
		</div>
	);
}
