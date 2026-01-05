import "./About.scss";
import profileDeveloper from '/about/profile-developer.svg';
import collaborationIcon from '/about/collaborateur.svg';
import objectifIcon from '/about/objectif.svg';
import bloomfundLogo from '/about/bloomfund.svg';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function About() {
	const [nbProjet, setNbProjet] = useState(0);
	const [nbContributeur, setNbContributeur] = useState(0);
	const [nbFondCollecte, setNbFondCollecte] = useState(0);

	useEffect(() => {
		try {
			const response = axios
				.get(`${import.meta.env.VITE_API_URL}/projets`)
				.then(response => {
					setNbProjet(response.data.length);
				})
				.catch(error => {
					console.error('Erreur lors de la récupération du nombre de projets :', error);
				});
			const responseContributeur = axios
				.get(`${import.meta.env.VITE_API_URL}/contributions/all`)
				.then(responseContributeur => {
					setNbContributeur(responseContributeur.data.contributions.length);
					setNbFondCollecte(responseContributeur.data.total.split('.')[0]);
				})
				.catch(error => {
					console.error('Erreur lors de la récupération du nombre de contributeurs :', error, responseContributeur, response);
				});
		} catch (error) {
			console.error(error.message);
		}
	}, []);

	return (
		<>
			<div className="min-h-screen bg-white pt-20">
				<div className="bg-green-600 text-white py-16 px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl mb-4">Bloomfund</h1>
						<p className="text-lg opacity-90">Plateforme de financement participatif pour les projets écologiques</p>
					</div>
				</div>

				<div className="max-w-4xl mx-auto px-4 py-16 text-center">
					<h2 className="text-2xl mb-6">Notre Mission</h2>
					<p className="text-gray-700 leading-relaxed">
						Nous connectons les porteurs de projets écologiques avec des contributeurs engagés pour créer un impact positif sur notre planète.
						Ensemble, faisons grandir les projets qui changent le monde.
					</p>
				</div>
				<div className="bg-green-50 py-12 px-4">
					<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
						<div>
							<div className="flex justify-center mb-4">
								<div className="bg-green-600 text-white p-4 rounded-full">
									<img src={bloomfundLogo} alt="collaboration icon" />
								</div>
							</div>
							<div className="text-2xl mb-1">{nbProjet}+</div>
							<p className="text-gray-600">Projets financés</p>
						</div>
						<div>
							<div className="flex justify-center mb-4">
								<div className="bg-green-600 text-white p-4 rounded-full">
									<img src={collaborationIcon} alt="collaboration icon" />
								</div>
							</div>
							<div className="text-2xl mb-1">{nbContributeur}+</div>
							<p className="text-gray-600">Contributeurs</p>
						</div>
						<div>
							<div className="flex justify-center mb-4">
								<div className="bg-green-600 text-white p-4 rounded-full">
									<img src={objectifIcon} alt="objectif icon" />
								</div>
							</div>
							<div className="text-2xl mb-1">{nbFondCollecte}€</div>
							<p className="text-gray-600">Fonds collectés</p>
						</div>
					</div>
				</div>

				{/* Team */}
				<div className="max-w-5xl mx-auto px-4 py-16">
					<h2 className="text-2xl mb-12 text-center">L'Équipe</h2>
					<div className="flex justify-center gap-12">
						{[
							{ id: 1, name: 'Ychnightder PIERRE' },
							{ id: 2, name: 'Pascal LIU' },
							{ id: 3, name: 'Bryan BARET' },
							{ id: 4, name: 'Elias BOUTEBAKH' },
							{ id: 5, name: 'Deynis BRIVAL LARUE' },
						].map(member => (
							<div key={member.id} className="text-center">
								<img
									src={profileDeveloper}
									className="w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center"
									alt="profile developer"
								/>

								<p className="text-sm">{member.name}</p>
							</div>
						))}
					</div>
				</div>

				{/* CTA */}
				<div className="bg-green-600 text-white py-12 px-4 text-center">
					<h2 className="text-2xl mb-4">Rejoignez-nous</h2>
					<p className="mb-6 opacity-90">Lancez votre projet ou soutenez une initiative écologique</p>
					<button className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors">
						<a href="/rechercher">Découvrir les projets</a>
					</button>
				</div>
			</div>
		</>
	);
}
