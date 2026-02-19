import 'dotenv/config';

interface GenerateDescriptionInput {
	titre: string;
	categorie?: string;
	currentDescription?: string;
	objectifFinancier?: string | number;
	promptType: 'complete' | 'improve' | 'expand';
}

export const AIService = {
	async generateDescription(data: GenerateDescriptionInput): Promise<string> {
		const apiKey = process.env.GROQ_API_KEY;
        console.log('GROQ_API_KEY:', apiKey );
		
		if (!apiKey) {
			throw new Error('Clé API Groq non configurée. Veuillez définir GROQ_API_KEY dans votre fichier .env');
		}

		const systemPrompt = `Tu es un expert en crowdfunding et en rédaction de descriptions de projets de financement participatif. 
Tu aides les porteurs de projets à rédiger des descriptions convaincantes et professionnelles qui incitent les contributeurs à soutenir leur projet.

Règles importantes :
- Écris toujours en français
- Sois enthousiaste mais authentique
- Structure le texte de manière claire avec des paragraphes
- Inclus des éléments qui inspirent confiance
- Reste concis mais complet (200-500 mots)
- N'utilise pas de markdown ou de caractères spéciaux inutiles
- Adapte le ton au type de projet`;

		let userPrompt = '';

		switch (data.promptType) {
			case 'complete':
				userPrompt = `Génère une description complète et professionnelle pour un projet de crowdfunding avec les informations suivantes :

Titre du projet : ${data.titre}
${data.categorie ? `Catégorie : ${data.categorie}` : ''}
${data.objectifFinancier ? `Objectif financier : ${data.objectifFinancier}€` : ''}

La description doit :
1. Commencer par une accroche captivante
2. Expliquer clairement le projet et son objectif
3. Justifier le besoin de financement
4. Détailler comment les fonds seront utilisés
5. Terminer par un appel à l'action motivant`;
				break;

			case 'improve':
				userPrompt = `Améliore et optimise cette description de projet de crowdfunding tout en conservant l'essence du message :

Description actuelle :
"""
${data.currentDescription}
"""

Titre du projet : ${data.titre}
${data.categorie ? `Catégorie : ${data.categorie}` : ''}
${data.objectifFinancier ? `Objectif financier : ${data.objectifFinancier}€` : ''}

Améliore le texte pour le rendre plus :
- Professionnel et bien structuré
- Engageant et convaincant
- Clair sur les objectifs et l'utilisation des fonds`;
				break;

			case 'expand':
				userPrompt = `Enrichis et développe cette description de projet de crowdfunding avec plus de détails :

Description actuelle :
"""
${data.currentDescription}
"""

Titre du projet : ${data.titre}
${data.categorie ? `Catégorie : ${data.categorie}` : ''}
${data.objectifFinancier ? `Objectif financier : ${data.objectifFinancier}€` : ''}

Ajoute des éléments comme :
- Plus de contexte sur le projet
- Des détails sur l'équipe ou le porteur du projet
- Une explication de l'utilisation des fonds
- Des éléments rassurants pour les contributeurs`;
				break;
		}

		try {
			const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
					messages: [
						{ role: 'system', content: systemPrompt },
						{ role: 'user', content: userPrompt },
					],
					temperature: 0.7,
					max_tokens: 1000,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Erreur Groq:', errorData);
				throw new Error(errorData.error?.message || 'Erreur lors de la communication avec l\'API Groq');
			}

			const result = await response.json() as {
				choices: Array<{ message: { content: string } }>;
			};
			
			const generatedText = result.choices?.[0]?.message?.content;
			
			if (!generatedText) {
				throw new Error('Aucune réponse générée par l\'IA');
			}

			return generatedText.trim();
		} catch (error) {
			console.error('Erreur service IA:', error);
			throw error;
		}
	},
};
