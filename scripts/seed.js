import axios from 'axios';
import { faker } from '@faker-js/faker';

// Configurer faker en français
faker.locale = 'fr';

const API_URL = 'http://localhost:3000/api';
const UNSPLASH_API_KEY = 'gV4rJ3sXebcDmTP6SwLHHuIpTm0Xvi8f_-BdE52pII4';

// Titres de projets français réalistes
const titresProjets = [
	"Rénovation de l'église du village",
	"Jardin partagé écologique",
	"Sauvetage du cinéma local",
	"Vélos électriques pour tous",
	"Ferme pédagogique solidaire",
	"Café associatif du quartier",
	"Potager urbain participatif",
	"Bibliothèque mobile rurale",
	"Épicerie solidaire locale",
	"Atelier de réparation vélos",
	"Cuisine partagée du quartier",
	"Maison des jeunes rénovée",
	"Parc naturel protégé",
	"Centre d'accueil pour animaux",
	"Festival culturel annuel",
	"Conserverie artisanale locale",
	"Tiers-lieu numérique rural",
	"Navette solidaire villages",
	"Recyclerie créative",
	"Brasserie artisanale bio",
	"Fromagerie coopérative",
	"Maraîchage biologique",
	"École de musique populaire",
	"Habitat partagé seniors",
	"Ressourcerie du territoire",
	"Verger conservatoire",
	"Micro-crèche parentale",
	"Food-truck solidaire",
	"Tiny house écologique",
	"Refuge pour abeilles",
];

// Descriptions de projets en français
const getDescriptionFr = () => {
	const intros = [
		"Notre projet vise à créer un espace de vie et de partage pour les habitants du quartier.",
		"Nous souhaitons développer une initiative locale et solidaire pour notre territoire.",
		"Ce projet est né de la volonté de citoyens engagés pour leur communauté.",
		"Face aux défis environnementaux, nous proposons une solution concrète et locale.",
		"Notre association porte ce projet depuis plusieurs mois avec passion.",
	];
	const corps = [
		"Grâce à votre soutien, nous pourrons financer les travaux nécessaires et acheter le matériel indispensable au bon fonctionnement de notre initiative.",
		"Chaque contribution compte et nous permettra d'atteindre notre objectif pour faire vivre ce lieu unique.",
		"Votre générosité nous aidera à concrétiser ce rêve collectif au service de tous.",
		"Ensemble, nous pouvons transformer cette idée en réalité tangible pour notre territoire.",
		"Les fonds récoltés serviront à lancer la première phase de ce projet ambitieux.",
	];
	const conclusions = [
		"Rejoignez-nous dans cette belle aventure humaine et solidaire !",
		"Merci pour votre confiance et votre engagement à nos côtés.",
		"Chaque euro compte, ensemble nous ferons la différence.",
		"Participez à cette initiative citoyenne qui fait sens.",
		"Votre soutien est précieux pour notre communauté.",
	];
	return `${faker.helpers.arrayElement(intros)}\n\n${faker.helpers.arrayElement(corps)}\n\n${faker.helpers.arrayElement(conclusions)}`;
};

// Commentaires français réalistes
const commentairesFr = [
	"Superbe initiative ! Je soutiens à 100%.",
	"Bravo pour ce projet, notre village en a bien besoin.",
	"J'ai contribué avec plaisir, bonne continuation !",
	"Très beau projet citoyen, merci pour votre engagement.",
	"Enfin une initiative locale et concrète !",
	"Je partage autour de moi, vous méritez de réussir.",
	"Hâte de voir ce projet aboutir, courage à l'équipe !",
	"Excellent projet, j'espère qu'il atteindra son objectif.",
	"C'est exactement ce dont notre quartier avait besoin.",
	"Belle initiative solidaire, je suis fier de contribuer.",
	"Continuez comme ça, on est avec vous !",
	"Un projet porteur de sens pour notre territoire.",
	"Merci de penser à notre communauté.",
	"J'ai partagé sur les réseaux, ça mérite d'être connu !",
	"Projet inspirant, bravo à toute l'équipe.",
	"Je contribue modestement mais de tout cœur.",
	"Vivement que ce projet voie le jour !",
	"Super idée, je soutiens cette belle cause.",
	"Notre région a besoin de projets comme celui-ci.",
	"Félicitations pour cette initiative citoyenne !",
];

// Token récupéré dynamiquement lors de l'inscription
let currentToken = null;
// const getAuthHeaders = () => ({
// 	headers: { Authorization: `Bearer ${currentToken}` }
// });

// Récupérer les départements français
async function getDepartements() {
	try {
		const response = await axios.get('https://geo.api.gouv.fr/departements');
		return response.data.map(dep => `${dep.nom} (${dep.code})`);
	} catch (err) {
		console.error('Erreur API départements:', err.message);
		return ['Paris (75)', 'Bouches-du-Rhône (13)', 'Rhône (69)', 'Nord (59)', 'Gironde (33)'];
	}
}

async function getUnsplashImages(query, count = 3) {
	if (!query) {
		return Array(count).fill(null).map((_, i) => `https://picsum.photos/600/400?random=${Date.now() + i}`);
	}
	try {
		// Page aléatoire pour varier les résultats
		const randomPage = Math.floor(Math.random() * 10) + 1;
		const response = await axios.get('https://api.unsplash.com/search/photos', {
			params: { 
				query: query, 
				per_page: count, 
				page: randomPage,
				orientation: 'landscape'
			},
			headers: { Authorization: `Client-ID ${UNSPLASH_API_KEY}` },
		});
		const results = response.data.results || [];

        // console.log(`Unsplash: récupéré ${results.length} images pour "${query}" (page ${randomPage})`);

		if (results.length === 0) {
			return Array(count).fill(null).map((_, i) => `https://picsum.photos/600/400?random=${Date.now() + i}`);
		}
		return results.map(photo => photo.urls.regular);
	} catch (err) {
		console.error('Erreur Unsplash:', err.response?.status || err.message);
		// Fallback vers picsum avec des IDs uniques
		return Array(count).fill(null).map((_, i) => `https://picsum.photos/600/400?random=${Date.now() + i}`);
	}
}

// Délai entre les requêtes pour éviter le rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function seed() {
	try {
		console.log('Création des utilisateurs...');
		const users = [];
		let firstUserEmail = null;
		
		for (let i = 0; i < 75; i++) {
			const user = {
				prenom: faker.person.firstName(),
				nom: faker.person.lastName(),
				email: faker.internet.email(),
				mot_de_passe: 'Password123!',
                role :'citoyen',
			};
			try {
				await axios.post(`${API_URL}/utilisateurs/register`, user);
				// Stocker l'email et récupérer l'id depuis la réponse ou le login plus tard
				users.push({ email: user.email, mot_de_passe: user.mot_de_passe });
				// Sauvegarder l'email du premier utilisateur pour login
				if (!firstUserEmail) {
					firstUserEmail = user.email;
				}
				console.log(`Utilisateur ${i + 1}/100 créé`);
			} catch (err) {
				console.error(`Erreur utilisateur ${i}:`, err.response?.data || err.message);
			}
		}

		// Se connecter avec le premier utilisateur pour obtenir un token
		if (firstUserEmail) {
			try {
				const loginRes = await axios.post(`${API_URL}/utilisateurs/login`, {
					email: firstUserEmail,
					mot_de_passe: 'Password123!'
				});
				currentToken = loginRes.data.token;
				console.log('Token récupéré depuis le login');
			} catch (err) {
				console.error('Erreur login:', err.response?.data || err.message);
			}
		}

		// Récupérer les IDs des utilisateurs en les connectant un par un
		let usersWithIds = [];
		console.log('Récupération des IDs utilisateurs via login...');
		for (const user of users) {
			try {
				const loginRes = await axios.post(`${API_URL}/utilisateurs/login`, {
					email: user.email,
					mot_de_passe: user.mot_de_passe
				});
				// Décoder le token JWT pour obtenir l'ID
				const tokenPayload = JSON.parse(atob(loginRes.data.token.split('.')[1]));
				usersWithIds.push({ id: tokenPayload.id, email: user.email });
			} catch (err) {
				// Ignorer les erreurs de login
                console.error(`Erreur login pour ${user.email}:`, err.response?.data || err.message);
			}
		}
		console.log(`${usersWithIds.length} utilisateurs avec IDs récupérés`);

		// Fonction pour obtenir un token pour un utilisateur
		const userTokens = {};
		async function getTokenForUser(email) {
			if (userTokens[email]) return userTokens[email];
			try {
				const loginRes = await axios.post(`${API_URL}/utilisateurs/login`, {
					email: email,
					mot_de_passe: 'Password123!'
				});
				userTokens[email] = loginRes.data.token;
				return loginRes.data.token;
			} catch (err) {
                console.error(`Erreur login pour ${email}:`, err.response?.data || err.message);
				return currentToken;
			}
		}

		console.log('Création des projets...');

		let categories = [];
		try {
			const response = await axios.get(`${API_URL}/categories`);
			categories = response.data;
			console.log(`${categories.length} catégories récupérées`);
		} catch (error) {
			console.error('Erreur lors de la récupération des catégories :', error.message);
			categories = [{ categorie_id: 1 }, { categorie_id: 2 }, { categorie_id: 3 }]; // Fallback
		}

		// Récupérer les départements français
		const departements = await getDepartements();
		console.log(`${departements.length} départements récupérés`);

		const projets = [];
		let titreIndex = 0;
		for (let i = 0; i < 50; i++) {
			const category = faker.helpers.arrayElement(categories);
			
			// Créer une date de fin entre 1 et 12 mois dans le futur
			const dateFin = new Date();
			dateFin.setMonth(dateFin.getMonth() + faker.number.int({ min: 1, max: 12 }));

			// Utiliser un titre réaliste ou en générer un
			const titre = titreIndex < titresProjets.length 
				? titresProjets[titreIndex++] 
				: `Projet solidaire - ${faker.helpers.arrayElement(departements).split(' ')[0]}`;

			const projet = {
				titre: titre,
				description: getDescriptionFr(),
				objectif_financier: faker.number.int({ min: 2000, max: 50000 }),
				localisation: faker.helpers.arrayElement(departements),
				date_fin: dateFin.toISOString(),
				categorie_id: category.categorie_id || category.id,
				image_url: JSON.stringify(await getUnsplashImages(category.nom || 'nature', 3)),
			};

			// Changer de token pour avoir des porteurs différents
			const randomPorteur = faker.helpers.arrayElement(usersWithIds);
			const porteurToken = await getTokenForUser(randomPorteur.email);
			
			try {
				const res = await axios.post(`${API_URL}/projets`, projet, {
					headers: { Authorization: `Bearer ${porteurToken}` }
				});
				projets.push({ ...res.data, porteur_id: randomPorteur.id });
				console.log(`Projet ${i + 1}/50 créé`);
				// Délai pour éviter le rate limit Unsplash
				await delay(1500);
			} catch (err) {
				console.error(`Erreur projet ${i}:`, err.response?.data || err.message);
			}
		}

		console.log('Création des contributions...');
		if (usersWithIds.length === 0 || projets.length === 0) {
			console.error('Pas assez de données pour créer des contributions');
			console.log(`Users: ${usersWithIds.length}, Projets: ${projets.length}`);
		} else {
			// Plus de contributions avec des montants plus élevés
			for (let i = 0; i < 200; i++) {
				const randomUser = faker.helpers.arrayElement(usersWithIds);
				const randomProjet = faker.helpers.arrayElement(projets);
				const userToken = await getTokenForUser(randomUser.email);
				
				const contribution = {
					montant: faker.number.int({ min: 20, max: 1000 }),
					utilisateur_id: randomUser.id || randomUser.utilisateur_id,
					projet_id: randomProjet.id || randomProjet.projet_id,
				};
				try {
					await axios.post(`${API_URL}/contributions`, contribution, {
						headers: { Authorization: `Bearer ${userToken}` }
					});
					console.log(`Contribution ${i + 1}/200 créée (${contribution.montant}€)`);
				} catch (err) {
					console.error(`Erreur contribution ${i}:`, err.response?.data || err.message);
				}
			}
		}

		console.log('Création des commentaires...');
		if (usersWithIds.length === 0 || projets.length === 0) {
			console.error('Pas assez de données pour créer des commentaires');
		} else {
			// Commentaires sur TOUS les projets
			for (const projet of projets) {
				const nbComments = faker.number.int({ min: 3, max: 8 });
				console.log(`Ajout de ${nbComments} commentaires au projet ${projet.id || projet.projet_id}`);
				for (let i = 0; i < nbComments; i++) {
					const randomUser = faker.helpers.arrayElement(usersWithIds);
					const userToken = await getTokenForUser(randomUser.email);
					const commentaire = {
						contenu: faker.helpers.arrayElement(commentairesFr),
						utilisateur_id: randomUser.id || randomUser.utilisateur_id,
						projet_id: projet.id || projet.projet_id,
					};
					try {
						await axios.post(`${API_URL}/commentaires`, commentaire, {
							headers: { Authorization: `Bearer ${userToken}` }
						});
					} catch (err) {
						console.error(`Erreur commentaire:`, err.response?.data || err.message);
					}
				}
			}
		}

		console.log('✅ Base remplie avec succès via l\'API !');
	} catch (err) {
		console.error('Erreur seed:', err.response?.data || err.message);
	}
}

seed();
