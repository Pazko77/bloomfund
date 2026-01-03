// LegalPages.jsx
import React, { useState } from 'react';

export default function LegalPages() {
	const [openSections, setOpenSections] = useState([0]); // Premier accordéon ouvert par défaut

	const toggleSection = index => {
		setOpenSections(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
	};

	const sections = [
		{
			title: 'Informations Légales',
			content: [
				'La plateforme BloomFund est éditée par la société XYZ, dont le siège social est situé à Paris, France.',
				'Directeur de la publication : Monsieur/Madame ...',
				'Pour toute question, contactez-nous à contact@bloomfund.com.',
			],
		},
		{
			title: 'Mentions Légales',
			content: [
				"Le site et chacun des éléments qui le composent (architecture, textes, photographies, illustrations, programmes informatiques) sont la propriété exclusive de l'éditeur, conformément au Code de la propriété intellectuelle.",
				"Toute reproduction ou représentation, totale ou partielle, du site ou de l'un de ses éléments, sans l'autorisation expresse de l'éditeur, est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.",
				"L'éditeur ne saurait être tenu responsable des erreurs typographiques ou de l'inexactitude des informations présentes sur le site.",
			],
		},
		{
			title: "Conditions Générales d'Utilisation",
			content: [
				"L'accès et l'utilisation de la plateforme BloomFund valent acceptation sans réserve des présentes conditions générales. L'éditeur met en œuvre une obligation de moyens pour assurer la disponibilité du service mais ne saurait garantir une accessibilité permanente.",
				"L'utilisateur s'interdit de publier tout contenu contraire à l'ordre public, aux bonnes mœurs ou portant atteinte aux droits de tiers. Il est seul responsable des données qu'il diffuse et des transactions qu'il initie.",
				"En cas de manquement aux présentes règles, BloomFund se réserve le droit de suspendre ou de supprimer le compte de l'utilisateur de plein droit et sans préavis, sans préjudice d'éventuels dommages et intérêts.",
			],
		},
		{
			title: 'Propriété Intellectuelle des Utilisateurs',
			content: [
				"L'utilisateur reste titulaire de l'ensemble des droits de propriété intellectuelle sur les contenus (textes, images, projets) qu'il publie sur BloomFund.",
				"Toutefois, en publiant sur la plateforme, l'utilisateur concède à l'éditeur une licence non exclusive, gratuite et mondiale permettant de reproduire et de diffuser ces contenus pour les besoins du fonctionnement du service.",
				"L'utilisateur garantit qu'il dispose des droits nécessaires à la publication de ces contenus et qu'ils ne portent pas atteinte aux droits de tiers.",
			],
		},
		{
			title: 'Politique de Confidentialité',
			content: [
				"Le traitement de vos données personnelles est effectué dans le strict respect du Règlement Général sur la Protection des Données (RGPD) et de la loi « Informatique et Libertés ».",
				"Les données collectées sont strictement limitées à celles nécessaires à l'exécution des services proposés par la plateforme (création de compte, gestion technique) et ne sont en aucun cas cédées à des tiers à des fins commerciales.",
				"Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données, que vous pouvez exercer en contactant l'éditeur par email.",
			],
		},
		{
			title: 'Droit Applicable et Juridiction',
			content: [
				"Les présentes conditions d'utilisation sont régies, interprétées et appliquées conformément au droit français.",
				"En cas de litige relatif à l'interprétation ou à l'exécution des présentes, et à défaut d'accord amiable, compétence exclusive est attribuée aux tribunaux français du ressort du siège social de l'éditeur.",
			],
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 p-8 flex justify-center">
			<div className="max-w-4xl w-full bg-white p-8 rounded shadow-md space-y-4">
				<h1 className="text-4xl font-bold text-green-700 text-center mb-8">Informations Légales & Conditions</h1>
				{sections.map((section, index) => {
					const isOpen = openSections.includes(index);
					return (
						<div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
							<button
								onClick={() => toggleSection(index)}
								className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
							>
								<h2 className="text-xl font-semibold text-green-600">{section.title}</h2>
								<svg
									className={`w-6 h-6 text-green-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							<div
								className={`transition-all duration-300 ease-in-out overflow-hidden ${
									isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
								}`}
							>
								<div className="p-5 space-y-3 text-gray-700 border-t border-gray-200">
									{section.content.map((paragraph, idx) => (
										<p key={idx}>{paragraph}</p>
									))}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
