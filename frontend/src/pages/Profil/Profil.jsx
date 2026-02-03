import './Profil.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirstImage } from './../../helpers/image/parseImg';
import { useAuth } from '../../hook/useAuth';
import api from '../../helpers/request/api';

const Profil = () => {
	const navigate = useNavigate();
	const userProfil = useAuth();

	const [user, setUser] = useState(null);
	const [projets, setProjets] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordData, setPasswordData] = useState({
		ancienMotDePasse: '',
		nouveauMotDePasse: '',
		confirmationMotDePasse: '',
	});
	const [passwordError, setPasswordError] = useState('');
	const [passwordSuccess, setPasswordSuccess] = useState('');
	const [formData, setFormData] = useState({
		nom: '',
		prenom: '',
		email: '',
		departement: '',
	});

	useEffect(() => {
		if (userProfil.isLogged === false) {
			navigate('/connexion');
		}
	}, [userProfil.isLogged, navigate]);

	useEffect(() => {
		const fetchUserProfil = async () => {
			if (userProfil.isLogged) {
				setUser(userProfil.userCtx);
			}
		};
		fetchUserProfil();
	}, [userProfil.isLogged, userProfil.userCtx]);

	// Récupérer les projets de l'utilisateur si porteur de projet
	useEffect(() => {
		const fetchProjets = async () => {
			if (user && (user.role === 'porteur_projet' || user.role === 'admin')) {
				try {
					const response = await api.get(`/projets`);
					const mesProjets = response.data.filter(projet => projet.porteur_nom === user.nom && projet.porteur_prenom === user.prenom);
					setProjets(mesProjets);
				} catch (error) {
					console.error('Erreur lors de la récupération des projets:', error);
				}
			}
		};
		fetchProjets();
	}, [user]);

	const handleInputChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			await api.put(`/utilisateurs/profile/update`, formData);
			setUser({ ...user, ...formData });
			setIsEditing(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCancel = () => {
		setFormData({
			nom: user.nom,
			prenom: user.prenom,
			email: user.email,
			departement: user.departement || '',
		});
		setIsEditing(false);
	};

	const handlePasswordChange = e => {
		setPasswordData({
			...passwordData,
			[e.target.name]: e.target.value,
		});
		setPasswordError('');
	};

	const handlePasswordSubmit = async e => {
		e.preventDefault();
		setPasswordError('');
		setPasswordSuccess('');

		if (passwordData.nouveauMotDePasse !== passwordData.confirmationMotDePasse) {
			setPasswordError('Les mots de passe ne correspondent pas');
			return;
		}

		if (passwordData.nouveauMotDePasse.length < 6) {
			setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
			return;
		}

		try {
			await api.put(`/utilisateurs/password`, {
				ancienMotDePasse: passwordData.ancienMotDePasse,
				nouveauMotDePasse: passwordData.nouveauMotDePasse,
			});
			setPasswordSuccess('Mot de passe modifié avec succès');
			setPasswordData({
				ancienMotDePasse: '',
				nouveauMotDePasse: '',
				confirmationMotDePasse: '',
			});
			setTimeout(() => {
				setIsChangingPassword(false);
				setPasswordSuccess('');
			}, 2000);
		} catch (error) {
			setPasswordError(error.response?.data?.message || 'Erreur lors de la modification du mot de passe');
		}
	};

	const handleCancelPassword = () => {
		setPasswordData({
			ancienMotDePasse: '',
			nouveauMotDePasse: '',
			confirmationMotDePasse: '',
		});
		setPasswordError('');
		setPasswordSuccess('');
		setIsChangingPassword(false);
	};

	const handleLogout = async () => {
		try {
			await api.post(`/utilisateurs/logout`);
		} catch (error) {
			console.error(error);
		}
		navigate('/');
	};

	if (!user) {
		return (
			<div className="w-full h-screen flex justify-center items-center">
				<img src="/shared/loader.svg" alt="Loading..." />
			</div>
		);
	}

	return (
		<>
			<div className="bg-green-600 text-white py-10 px-4 ">
				<div className="max-w-4xl mx-auto text-center"></div>
			</div>

			<div className="profil-page ">
				{/* // bg-[url('https://images.unsplash.com/photo-1717900127460-165a54266392')] bg-cover bg-center min-h-screen */}
				<div className="w-full max-w-4xl mx-auto p-8  ">
					<h1 className="text-3xl mb-8">Mon Profil</h1>

					{/* Section Informations Personnelles */}
					<div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl">Informations Personnelles</h2>
							{!isEditing && (
								<button
									onClick={() => setIsEditing(true)}
									className="bg-[#4c9a4e] text-white px-6 py-2 rounded-lg hover:bg-[#3e7a3b] transition-colors">
									Modifier
								</button>
							)}
						</div>

						{isEditing ? (
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<label htmlFor="prenom" className="block text-sm mb-2 text-gray-700">
											Prénom
										</label>
										<input
											type="text"
											id="prenom"
											name="prenom"
											value={formData.prenom}
											onChange={handleInputChange}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9a4e]"
											required
										/>
									</div>

									<div>
										<label htmlFor="nom" className="block text-sm mb-2 text-gray-700">
											Nom
										</label>
										<input
											type="text"
											id="nom"
											name="nom"
											value={formData.nom}
											onChange={handleInputChange}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9a4e]"
											required
										/>
									</div>
								</div>

								<div>
									<label htmlFor="email" className="block text-sm mb-2 text-gray-700">
										Email
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9a4e]"
										required
									/>
								</div>

								<div>
									<label htmlFor="departement" className="block text-sm mb-2 text-gray-700">
										Département
									</label>
									<input
										type="text"
										id="departement"
										name="departement"
										value={formData.departement}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9a4e]"
										placeholder="Ex: 75"
									/>
								</div>

								<div className="flex gap-4">
									<button type="submit" className="bg-[#4c9a4e] text-white px-6 py-3 rounded-lg hover:bg-[#3e7a3b] transition-colors">
										Enregistrer
									</button>
									<button
										type="button"
										onClick={handleCancel}
										className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors">
										Annuler
									</button>
								</div>
							</form>
						) : (
							<div className="space-y-6">
								<div className="flex items-center gap-6 pb-6 border-b border-gray-200">
									<div className="w-24 h-24 bg-[#4c9a4e] rounded-full flex items-center justify-center text-white text-3xl">
										{user.prenom[0].toUpperCase()}
										{user.nom[0].toUpperCase()}
									</div>
									<div>
										<h3 className="text-2xl">
											{user.prenom.charAt(0).toUpperCase() + user.prenom.slice(1)} {user.nom.charAt(0).toUpperCase() + user.nom.slice(1)}
										</h3>
										<p className="text-gray-500">
											{user.role === 'porteur_projet' ? 'Porteur de projet' : user.role === 'admin' ? 'Administrateur' : 'Citoyen'}
										</p>
									</div>
								</div>

								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<p className="text-sm text-gray-500 mb-1">Email</p>
										<p className="text-gray-900">{user.email}</p>
									</div>

									<div>
										<p className="text-sm text-gray-500 mb-1">Département</p>
										<p className="text-gray-900">{user.departement || 'Non renseigné'}</p>
									</div>

									<div>
										<p className="text-sm text-gray-500 mb-1">Rôle</p>
										<p className="text-gray-900">
											{user.role === 'porteur_projet' ? 'Porteur de projet' : user.role === 'admin' ? 'Administrateur' : 'Citoyen'}
										</p>
									</div>

									<div>
										<p className="text-sm text-gray-500 mb-1">Membre depuis</p>
										<p className="text-gray-900">
											{new Date(user.date_inscription).toLocaleDateString('fr-FR', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</p>
									</div>
								</div>

								<div className="pt-6 border-t border-gray-200">
									{isChangingPassword ? (
										<form onSubmit={handlePasswordSubmit} className="space-y-4">
											<h3 className="text-lg font-medium mb-4">Changer le mot de passe</h3>

											{passwordError && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{passwordError}</div>}

											{passwordSuccess && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">{passwordSuccess}</div>}

											<div>
												<label htmlFor="ancienMotDePasse" className="block text-sm mb-2 text-gray-700">
													Ancien mot de passe
												</label>
												<input
													type="password"
													id="ancienMotDePasse"
													name="ancienMotDePasse"
													value={passwordData.ancienMotDePasse}
													onChange={handlePasswordChange}
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9a4e]"
													required
												/>
											</div>

											<div>
												<label htmlFor="nouveauMotDePasse" className="block text-sm mb-2 text-gray-700">
													Nouveau mot de passe
												</label>
												<input
													type="password"
													id="nouveauMotDePasse"
													name="nouveauMotDePasse"
													value={passwordData.nouveauMotDePasse}
													onChange={handlePasswordChange}
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9a4e]"
													required
												/>
											</div>

											<div>
												<label htmlFor="confirmationMotDePasse" className="block text-sm mb-2 text-gray-700">
													Confirmer le nouveau mot de passe
												</label>
												<input
													type="password"
													id="confirmationMotDePasse"
													name="confirmationMotDePasse"
													value={passwordData.confirmationMotDePasse}
													onChange={handlePasswordChange}
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9a4e]"
													required
												/>
											</div>

											<div className="flex gap-4">
												<button type="submit" className="bg-[#4c9a4e] text-white px-6 py-3 rounded-lg hover:bg-[#3e7a3b] transition-colors">
													Enregistrer
												</button>
												<button
													type="button"
													onClick={handleCancelPassword}
													className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors">
													Annuler
												</button>
											</div>
										</form>
									) : (
										<button onClick={() => setIsChangingPassword(true)} className="text-[#4c9a4e] hover:text-[#3e7a3b] font-medium">
											Changer le mot de passe
										</button>
									)}
								</div>
							</div>
						)}
					</div>
					{/* Section Mes Projets - visible uniquement pour les porteurs de projet */}
					{(user.role === 'porteur_projet' || user.role === 'admin') && (
						<div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl">Mes Projets</h2>
							</div>

							{projets.length === 0 ? (
								<p className="text-gray-500 text-center py-8">Vous n'avez pas encore créé de projet.</p>
							) : (
								<div className="space-y-6">
									{projets.map(projet => {
										const progress = (Number(projet.montant_collecte) / Number(projet.objectif_financier)) * 100;
										return (
											<div
												key={projet.projet_id}
												onClick={() => navigate(`/cagnotte/${projet.projet_id}`)}
												className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
												<img src={getFirstImage(projet.image_url)} alt={projet.titre} className="w-32 h-24 object-cover rounded-lg" />
												<div className="flex-1">
													<div className="flex items-start justify-between">
														<div>
															<h3 className="font-medium text-lg">{projet.titre}</h3>
															<p className="text-sm text-gray-600 line-clamp-2">{projet.description}</p>
														</div>
														<span
															className={`px-3 py-1 rounded-full text-xs font-medium ${
																projet.statut === 'publie'
																	? 'bg-green-100 text-green-700'
																	: projet.statut === 'en_attente'
																		? 'bg-yellow-100 text-yellow-700'
																		: 'bg-gray-100 text-gray-700'
															}`}>
															{projet.statut === 'publie' ? 'publié' : projet.statut === 'en_attente' ? 'en attente' : projet.statut}
														</span>
													</div>
													<div className="mt-2">
														<div className="flex justify-between text-sm mb-1">
															<span className="font-medium">{projet.montant_collecte}€ collectés</span>
															<span className="text-gray-500">{projet.objectif_financier}€</span>
														</div>
														<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
															<div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
														</div>
													</div>
													<div className="flex justify-between text-sm text-gray-500 mt-2">
														<span>{projet.localisation || 'France'}</span>
														<span>Fin le {new Date(projet.date_fin).toLocaleDateString('fr-FR')}</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					)}

					{/* Section Liens Légaux */}
					<div className="bg-white border border-gray-200 rounded-lg p-8">
						<h2 className="text-2xl mb-6">Informations Légales</h2>
						<div className="space-y-4">
							<a href="/legal" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<div className="flex items-center gap-3">
									<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<div>
										<h3 className="font-medium">Mentions Légales</h3>
										<p className="text-sm text-gray-600">Informations légales sur la plateforme</p>
									</div>
								</div>
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</a>

							<a href="/legal" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<div className="flex items-center gap-3">
									<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
									<div>
										<h3 className="font-medium">Conditions Générales d'Utilisation</h3>
										<p className="text-sm text-gray-600">Règles d'utilisation de la plateforme</p>
									</div>
								</div>
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</a>

							<a href="/legal" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<div className="flex items-center gap-3">
									<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
									<div>
										<h3 className="font-medium">Politique de Confidentialité</h3>
										<p className="text-sm text-gray-600">Protection de vos données personnelles</p>
									</div>
								</div>
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</div>
					</div>

					{/* Section Danger Zone */}
					<div className="bg-white p-4 mt-6">
						<button onClick={handleLogout} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
							Déconnexion
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profil;
