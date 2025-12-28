import express from 'express';
import cors from 'cors';

import userRoutes from './routes/Utilisateur.route';
import CategorieRouter from './routes/Categorie.routes';
import projetRouter from './routes/Projet.route';
import contributionRouter from './routes/Contribution.route';

// env setup
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
// app.use(express.urlencoded({ extended: true }));

app.use('/api/utilisateurs', userRoutes);
app.use('/api/categories', CategorieRouter);
app.use('/api/projets', projetRouter);
app.use('/api/contributions', contributionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
