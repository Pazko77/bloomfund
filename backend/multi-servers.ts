import express from 'express';
import cors from 'cors';

import userRoutes from './routes/Utilisateur.route';
import CategorieRouter from './routes/Categorie.routes';
import projetRouter from './routes/Projet.route';
import contributionRouter from './routes/Contribution.route';
import CommentaireRouter from './routes/commentaire.routes';
import PaymentIntentsRouter from './routes/paymentIntent.route';

function createApp() {
	const app = express();
	app.use(express.json());
	app.use(cors({ origin: '*', credentials: true }));

	app.use('/api/utilisateurs', userRoutes);
	app.use('/api/categories', CategorieRouter);
	app.use('/api/projets', projetRouter);
	app.use('/api/contributions', contributionRouter);
	app.use('/api/commentaires', CommentaireRouter);
	app.use('/api/payment-intents', PaymentIntentsRouter);
	return app;
}
const ports = process.env.PORTS ? process.env.PORTS.split(',').map(Number) : [3000, 3001, 3002, 3003, 3004];
ports.forEach(port => {
	const app = createApp();
	app.listen(port, () => {
		console.log(`-|Local: http://localhost:${port}/|-`);
	});
});

