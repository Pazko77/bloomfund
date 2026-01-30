import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/Utilisateur.route';
import CategorieRouter from './routes/Categorie.routes';
import projetRouter from './routes/Projet.route';
import contributionRouter from './routes/Contribution.route';
import CommentaireRouter from './routes/commentaire.routes';
import PaymentIntentsRouter from './routes/paymentIntent.route';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
// app.use(express.urlencoded({ extended: true }));

app.use('/api/utilisateurs', userRoutes);
app.use('/api/categories', CategorieRouter);
app.use('/api/projets', projetRouter);
app.use('/api/contributions', contributionRouter);
app.use('/api/commentaires', CommentaireRouter);
app.use('/api/payment-intents', PaymentIntentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`--Local: http://localhost:${PORT}/--`));

export default app;


