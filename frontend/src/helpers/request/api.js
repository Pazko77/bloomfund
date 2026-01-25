import axios from 'axios';




// const api = axios.create({
//   baseURL: '/api', 
//   withCredentials: true, 
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// Intercepteur pour gérer le rafraîchissement automatique du token si besoin
// (optionnel, à compléter selon votre logique de refresh)
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     if (error.response && error.response.status === 401) {
//       // Tenter de rafraîchir le token ici
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
