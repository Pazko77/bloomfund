import { Request, Response } from 'express';
import { AIService } from '../services/AI.service';

export const AIController = {
	async generateDescription(req: Request, res: Response) {
		try {
			const { titre, categorie, currentDescription, objectifFinancier, promptType } = req.body;

			if (!titre || !titre.trim()) {
				return res.status(400).json({ 
					message: 'Le titre du projet est requis pour générer une description' 
				});
			}

			if (!promptType || !['complete', 'improve', 'expand'].includes(promptType)) {
				return res.status(400).json({ 
					message: 'Type de génération invalide' 
				});
			}

			// Vérifier que la description existe pour les types improve et expand
			if ((promptType === 'improve' || promptType === 'expand') && !currentDescription?.trim()) {
				return res.status(400).json({ 
					message: 'Une description existante est requise pour ce type de génération' 
				});
			}

			const description = await AIService.generateDescription({
				titre: titre.trim(),
				categorie: categorie?.trim(),
				currentDescription: currentDescription?.trim(),
				objectifFinancier,
				promptType,
			});

			return res.json({ 
				success: true, 
				description 
			});
		} catch (error) {
			console.error('Erreur génération IA:', error);
			
			const errorMessage = error instanceof Error 
				? error.message 
				: 'Une erreur est survenue lors de la génération';
			
			return res.status(500).json({ 
				message: errorMessage 
			});
		}
	},
};
