import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { roundRobin } from './roundRobin';

const app = express();

// app.use(
// 	cors({
// 		origin: process.env.FRONTEND_URL || 'http://localhost:5173',
// 		credentials: true,
// 	})
// );

app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:5173',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

// Liste dynamique des serveurs à partir de la variable d'environnement PORTS
const ports = process.env.PORTS ? process.env.PORTS.split(',').map(Number) : [3000, 3001];
const servers = ports.map(port => ({ host: process.env.HOST || 'localhost', port }));
// Le Load Balancer intercepte tout

// || /(.*)/
app.all(/(.*)/, (req, res) => {
	// console.log(`[LB] Requête reçue : ${req.method} ${req.url}`);
	roundRobin(req, res, servers);
});

const PORT = process.env.LOAD_BALANCER_PORT || 8080;
app.listen(PORT, () => {
	console.log(`-|Load Balancer http://localhost:${PORT}/|-`);
});
