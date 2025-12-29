import "./About.scss";
import profileDeveloper from '/about/profile-developer.svg';
import collaborationIcon from '/about/collaborateur.svg';
import objectifIcon from '/about/objectif.svg';
import bloomfundLogo from '/about/bloomfund.svg';

export default function About() {
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
							<div className="text-2xl mb-1">000+</div>
							<p className="text-gray-600">Projets financés</p>
						</div>
						<div>
							<div className="flex justify-center mb-4">
								<div className="bg-green-600 text-white p-4 rounded-full">
									<img src={collaborationIcon} alt="collaboration icon" />
								</div>
							</div>
							<div className="text-2xl mb-1">0000+</div>
							<p className="text-gray-600">Contributeurs</p>
						</div>
						<div>
							<div className="flex justify-center mb-4">
								<div className="bg-green-600 text-white p-4 rounded-full">
									<img src={objectifIcon} alt="objectif icon" />
								</div>
							</div>
							<div className="text-2xl mb-1">0M€$£</div>
							<p className="text-gray-600">Fonds collectés</p>
						</div>
					</div>
				</div>

				{/* Team */}
				<div className="max-w-5xl mx-auto px-4 py-16">
					<h2 className="text-2xl mb-12 text-center">L'Équipe</h2>
					<div className="flex justify-center gap-12">
						{[1, 2, 3, 4, 5].map(id => (
							<div key={id} className="text-center">
								<img
									src={profileDeveloper}
									className="w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center"
									alt="profile developer"
								/>

								<p className="text-sm">John Doe</p>
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
