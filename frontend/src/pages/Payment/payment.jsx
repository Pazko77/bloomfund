import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { isTokenExpired } from './../../helpers/token/tokenExpire';
import { parseImages } from './../../helpers/image/parseImg';

 const stripePromise = loadStripe('pk_test_51Sl6P9GXKqhH0ez38lPOTJLcGpyeitYY1K3W1jIMXTms9bWFoPQrDLVbs2SBDMhHRtlNWMbC3knZZFEy6vlLd2Gx00UXWjYqYs');

 function CheckoutForm() {
		const [projet, setProjet] = useState(null);
		const [utilisateur, setUtilisateur] = useState(null);
		const [amount, setAmount] = useState(1);
		const [message, setMessage] = useState('');
		const [loading, setLoading] = useState(false);

		const { id } = useParams();
		const navigate = useNavigate();
		const stripe = useStripe();
		const elements = useElements();

		const token = localStorage.getItem('token');

		// Vérifier le token et rediriger si expiré
		useEffect(() => {
			if (isTokenExpired(token)) {
				navigate('/login');
			}
		}, [token, navigate]);

		// Récupérer le projet
		useEffect(() => {
			const fetchProjet = async () => {
				try {
					const response = await axios.get(`${import.meta.env.VITE_API_URL}/projets/${id}`);
					setProjet(response.data);
					// console.log('Projet récupéré :', response.data);
				} catch (error) {
					console.error('Erreur lors de la récupération du projet :', error);
				}
			};
			fetchProjet();
		}, [id]);

		// Récupérer l'utilisateur
		useEffect(() => {
			if (!token || isTokenExpired(token)) return;

			const fetchUtilisateur = async () => {
				try {
					const response = await axios.get(`${import.meta.env.VITE_API_URL}/utilisateurs/profile`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					setUtilisateur(response.data.Utilisateur);
				} catch (error) {
					console.error("Erreur lors de la récupération de l'utilisateur :", error);
				}
			};
			fetchUtilisateur();
		}, [token]);

		const handleSubmit = async e => {
			e.preventDefault();
			if (!stripe || !elements) return;

			setLoading(true);
			setMessage('');

			try {
				const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/payment-intents/create-payment-intent`, {
					montant: amount,
					utilisateur_id: utilisateur.id,
					projet_id: projet.projet_id,
				});

				const card = elements.getElement(CardElement);

				const result = await stripe.confirmCardPayment(data.clientSecret, {
					payment_method: { card },
				});

				// console.log(result);
				if (result.error) setMessage('Erreur paiement : ' + result.error.message);
				else if (result.paymentIntent.status === 'succeeded') {
					setMessage(`✅ Paiement de ${amount}€ réussi !`);
					setTimeout(() => {
						navigate(`/cagnotte/${id}`);
					}, 2000);
				}
			} catch (err) {
				console.error(err);
				setMessage('Erreur serveur : ' + err.message);
			}

			setLoading(false);
		};

		// Afficher un loading si projet ou utilisateur non chargés
		if (!projet) {
				return (
					<div className="w-full h-screen flex justify-center items-center">
						<img src="/shared/loader.svg" alt="Loading..." />
					</div>
				);
		}

		const progress = (Number(projet.montant_collecte) / Number(projet.objectif_financier)) * 100;
		const images = parseImages(projet);

		return (
			<>
				<div className="w-full max-w-8xl  p-8">
					<button
						onClick={() => navigate(`/cagnotte/${id}`)}
						className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
						Retour à la cagnotte
					</button>
					<div className="grid lg:grid-cols-2 gap-8">
						{/* Colonne gauche - Informations du projet */}
						<div className="space-y-6">
							<div className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg overflow-hidden">
								<img src={images[0]} alt={projet.titre} className="w-full h-64 object-cover" />
								<div className="p-6">
									<h1 className="text-3xl mb-4">{projet.titre}</h1>
									<p className="text-gray-700 mb-6">{projet.description}</p>

									{/* Barre de progression */}
									<div className="space-y-2 mb-6">
										<div className="flex justify-between text-sm">
											<span className="font-semibold text-green-600">{projet.montant_collecte}€ collectés</span>
											<span className="text-gray-600">sur {projet.objectif_financier}€</span>
										</div>
										<div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
											<div
												className="h-full bg-linear-to-r from-green-500 to-green-600 rounded-full transition-all duration-300"
												style={{ width: `${Math.min(progress, 100)}%` }}
											/>
										</div>
										<p className="text-sm text-gray-600">{Math.round(progress)}% de l'objectif atteint</p>
									</div>

									{/* Statistiques */}
									<div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
										<div>
											<p className="text-2xl font-semibold text-green-600">{Math.round(progress)}%</p>
											<p className="text-sm text-gray-600">Financé</p>
										</div>
										<div>
											<p className="text-2xl font-semibold text-green-600">{projet.montant_collecte}€</p>
											<p className="text-sm text-gray-600">Collectés</p>
										</div>
										<div>
											<p className="text-2xl font-semibold text-green-600">{projet.objectif_financier - projet.montant_collecte}€</p>
											<p className="text-sm text-gray-600">Restants</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<form onSubmit={handleSubmit} className=" p-6 bg-white shadow rounded space-y-6">
							<h2 className="text-2xl font-bold text-center text-green-600">Contribuer au projet</h2>

							{/* Montant */}
							<div>
								<label className="block text-gray-700 mb-2">Montant (€)</label>
								<input
									type="number"
									min="1"
									value={amount}
									onChange={e => setAmount(parseFloat(e.target.value))}
									className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
									required
								/>
							</div>

							{/* Carte */}
							<div>
								<label className="block text-gray-700 mb-2">Informations de carte</label>
								<div className="p-4 border rounded">
									<CardElement
										options={{
											style: {
												base: {
													fontSize: '16px',
													color: '#32325d',
													'::placeholder': { color: '#aab7c4' },
												},
												invalid: { color: '#fa755a' },
											},
										}}
									/>
								</div>
							</div>

							{/* Message */}
							{message && (
								<div className={`p-3 rounded ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>
							)}

							{/* Bouton */}
							<button
								type="submit"
								disabled={!stripe || loading}
								className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
								{loading ? 'Traitement...' : `Payer ${amount}€`}
							</button>

							<p className="text-xs text-gray-500 text-center mt-2">Paiement sécurisé par Stripe</p>
						</form>
						{/* <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
						<label>Montant :</label>
						<input type="number" min="1" value={amount} onChange={e => setAmount(Number(e.target.value))} />
						<div className="p-3 border rounded">
							<CardElement />
						</div>
						<button type="submit" disabled={!stripe || loading} className="bg-green-600 text-white py-2 px-4 rounded">
							{loading ? 'Traitement...' : `Payer ${amount}€`}
						</button>
						{message && <p>{message}</p>}
					</form> */}
					</div>
				</div>
			</>
		);
 }

export default function PaymentPage() {
	return (
		<>
			<Elements stripe={stripePromise}>
				<CheckoutForm />
			</Elements>
		</>
	);
}
