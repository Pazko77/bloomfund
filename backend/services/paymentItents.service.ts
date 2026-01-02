import pool from '../config/db';
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
import dotenv from 'dotenv';
dotenv.config();

/**
 * 
 *décommenté les partie commenter c'est un sécurité de stripe je peux pas commit la clé secrète
 */
export async function createPaymentIntent(montant: number, utilisateur_id: number, projet_id: number): Promise<string | void> {
	try {
		 const paymentIntent = await stripe.paymentIntents.create({
		 	amount: Math.round(montant * 100), // en centimes
		 	currency: 'eur',
		 	payment_method_types: ['card'],
		 });

		
		await pool.query('INSERT INTO Contributions (montant, utilisateur_id, projet_id) VALUES (?, ?, ?)', [montant, utilisateur_id, projet_id]);
		 return paymentIntent.client_secret;
	} catch (error) {
		console.error('Error creating payment intent:', error);
		throw error;
	}
}
