import { Request, Response } from 'express';
import { createPaymentIntent } from '../services/paymentItents.service';

export const PaymentIntentsController = {
	async createPaymentIntent(req: Request, res: Response) {
		try {
			const { montant, utilisateur_id, projet_id } = req.body;
			const clientSecret = await createPaymentIntent(montant, utilisateur_id, projet_id);
			res.status(201).json({ clientSecret });
		} catch (error) {
			res.status(500).json({ message: 'Erreur lors de la création du Payment Intent' });
		}
	},
};
