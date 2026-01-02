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
				"Toutes les informations concernant l'éditeur et l'hébergeur sont disponibles sur cette page.",
				"L'utilisation de la plateforme implique l'acceptation de nos mentions légales.",
			],
		},
		{
			title: "Conditions Générales d'Utilisation",
			content: [
				"Les présentes conditions régissent l'utilisation de la plateforme BloomFund.",
				"L'utilisateur s'engage à respecter les règles de publication et d'utilisation des services.",
				'Tout manquement peut entraîner la suspension ou la suppression du compte utilisateur.',
			],
		},
		{
			title: 'Politique de Confidentialité',
			content: [
				'Nous attachons une grande importance à la protection de vos données personnelles.',
				'Les informations collectées sont utilisées uniquement pour le bon fonctionnement de la plateforme.',
				"Vous pouvez exercer vos droits d'accès, de rectification et de suppression de vos données à tout moment.",
			],
		},
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
