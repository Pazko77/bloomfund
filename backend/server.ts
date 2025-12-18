import express from 'express';
import cors from 'cors';
import userRoutes from './routes/Utilisateur.route';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({ origin: '*', credentials: true }));

app.use('/api/utilisateurs', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
