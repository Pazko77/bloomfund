import axios from 'axios';
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
	withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = error => {
	failedQueue.forEach(prom => {
		error ? prom.reject(error) : prom.resolve();
	});
	failedQueue = [];
};

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (originalRequest.url.includes('/refresh-token')) {
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(() => api(originalRequest));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await api.post('/utilisateurs/refresh-token');

				processQueue(null);

				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(error);
	}
);

export default api;
