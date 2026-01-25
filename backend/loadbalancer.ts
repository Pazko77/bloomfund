import express from 'express';
import { roundRobin } from './Server/roundRobin';

const app = express();

// Liste de tes serveurs
const servers = [
	{ host: 'localhost', port: 3000 },
	{ host: 'localhost', port: 3001 },
	{ host: 'localhost', port: 3002 },
];

// Le Load Balancer intercepte tout
app.all(/(.*)/, (req, res) => {
	// console.log(`[LB] Requête reçue : ${req.method} ${req.url}`);
	roundRobin(req, res, servers);
});

const PORT = process.env.LOAD_BALANCER_PORT || 8080;
app.listen(PORT, () => {
	console.log(`🚀 Load Balancer démarré sur le port ${PORT}`);
});
