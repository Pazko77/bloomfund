import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/Utilisateur.route';
import CategorieRouter from './routes/Categorie.routes';
import projetRouter from './routes/Projet.route';
import contributionRouter from './routes/Contribution.route';
import CommentaireRouter from './routes/commentaire.routes';
import PaymentIntentsRouter from './routes/paymentIntent.route';
import contrepartieRouter from './routes/Contrepartie.route';
import aiRouter from './routes/AI.route';
import cookieParser from 'cookie-parser';

function createApp() {
	const app = express();
	// app.set('trust proxy', 1);
	app.use(express.json());
	// app.use(
	// 	cors({
	// 		origin: process.env.FRONTEND_URL || '*',
	// 		credentials: true,
	// 	})
	// );
	app.use(cookieParser());
	app.use('/api/utilisateurs', userRoutes);
	app.use('/api/categories', CategorieRouter);
	app.use('/api/projets', projetRouter);
	app.use('/api/contributions', contributionRouter);
	app.use('/api/commentaires', CommentaireRouter);
	app.use('/api/payment-intents', PaymentIntentsRouter);
	app.use('/api/contreparties', contrepartieRouter);
	app.use('/api/ai', aiRouter);

	return app;
}

const app = createApp();


export default app;

if (process.env.NODE_ENV !== 'production') {
	const ports = process.env.PORTS ? process.env.PORTS.split(',').map(Number) : [3000, 3001];
	ports.forEach(port => {
		const localApp = createApp();
		localApp.listen(port, () => {
			console.log(`-|Local: http://localhost:${port}/|-`);
		});
	});
}
