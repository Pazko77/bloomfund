import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { isTokenExpired } from './../../helpers/token/tokenExpire';

const stripePromise = loadStripe('pk_test_51Sl6P9GXKqhH0ez38lPOTJLcGpyeitYY1K3W1jIMXTms9bWFoPQrDLVbs2SBDMhHRtlNWMbC3knZZFEy6vlLd2Gx00UXWjYqYs');

function CheckoutForm() {
	const [projet, setProjet] = useState(null);
	const [utilisateur, setUtilisateur] = useState(null);
	const [amount, setAmount] = useState(10);
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

			console.log(result);
			if (result.error) setMessage('Erreur paiement : ' + result.error.message);
			else if (result.paymentIntent.status === 'succeeded') setMessage(`✅ Paiement de ${amount}€ réussi et enregistré dans la base !`);
		} catch (err) {
			console.error(err);
			setMessage('Erreur serveur : ' + err.message);
		}

		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
			<label>Montant :</label>
			<input type="number" min="1" value={amount} onChange={e => setAmount(Number(e.target.value))} />
			<div className="p-3 border rounded">
				<CardElement />
			</div>
			<button type="submit" disabled={!stripe || loading} className="bg-green-600 text-white py-2 px-4 rounded">
				{loading ? 'Traitement...' : `Payer ${amount}€`}
			</button>
			{message && <p>{message}</p>}
		</form>
	);
}

export default function PaymentPage() {
	return (
		<Elements stripe={stripePromise}>
			<CheckoutForm />
			<p className="text-sm text-gray-500">Carte test : 4242 4242 4242 4242 – date future – CVC au hasard</p>
		</Elements>
	);
}
