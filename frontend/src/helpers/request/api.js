import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Flag pour éviter les boucles infinies de rafraîchissement
let isRefreshing = false;
// File d'attente pour les requêtes échouées pendant le rafraîchissement
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		// Si l'erreur est 401 (Non autorisé) et que ce n'est pas déjà une tentative de retry
		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			// Éviter de boucler sur la route de refresh elle-même
			if (originalRequest.url.includes('/refresh-token')) {
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise(function (resolve, reject) {
					failedQueue.push({ resolve, reject });
				})
					.then(token => {
						if (token) {
							originalRequest.headers['Authorization'] = 'Bearer ' + token;
						}
						return api(originalRequest);
					})
					.catch(err => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				// Appel à la route de refresh token
				const { data } = await api.post('/utilisateurs/refresh-token');
				const newToken = data.token;
				console.log('Token rafraîchi' + newToken);

				if (newToken) {
					api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
					originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
				}

				processQueue(null, newToken);
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				// Optionnel : Rediriger vers le login si le refresh échoue
				// window.location.href = '/login';
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(error);
	}
);

export default api;
