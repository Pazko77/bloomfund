import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});

// Gestionnaire d'erreur global pour le proxy
proxy.on('error', (err, req, res: any) => {
	console.error('Erreur Proxy:', err.message);
	if (!res.headersSent) {
		res.writeHead(502, { 'Content-Type': 'text/plain' });
		res.end('Le serveur de destination est indisponible.');
	}
});

let currentServerIndex = 0;

export const roundRobin = (req: any, res: any, servers: { host: string; port: number }[]) => {
	const target = servers[currentServerIndex];
	const targetUrl = `http://${target.host}:${target.port}`;

	console.log(`[LoadBalancer] Redirection vers: ${targetUrl}`);

	currentServerIndex = (currentServerIndex + 1) % servers.length;

	proxy.web(req, res, { target: targetUrl });
};
