export function isTokenExpired(token) {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const now = Date.now() / 1000; // en secondes
		return payload.exp < now;
	// eslint-disable-next-line no-unused-vars
	} catch (e) {
		return true;
		//  console.error('Erreur lors de la vérification du token :', e);
	}
}