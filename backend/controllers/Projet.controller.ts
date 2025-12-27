import { Request, Response } from 'express';
import { ProjetService } from '../services/Projet.service';

export const ProjetController = {
	// CREATE
	async create(req: Request, res: Response) {
		const porteur_id = req.Utilisateur?.id;
		if (!porteur_id) return res.sendStatus(401);

		const success = await ProjetService.create(req.body, porteur_id);
		if (!success) {
			return res.status(500).json({ message: 'Erreur création projet' });
		}

		return res.status(201).json({ success: true });
	},

	// READ ALL
	async getAll(req: Request, res: Response) {
		const projets = await ProjetService.findAll();
		return res.json(projets);
	},

	// READ ONE
	async getOne(req: Request, res: Response) {
		const projet = await ProjetService.findById(Number(req.params.id));
		if (!projet) {
			return res.status(404).json({ message: 'Projet non trouvé' });
		}
		return res.json(projet);
	},

	// UPDATE
	async update(req: Request, res: Response) {
		const porteur_id = req.Utilisateur?.id;
		if (!porteur_id) return res.sendStatus(401);

		const success = await ProjetService.update(Number(req.params.id), porteur_id, req.body);

		if (!success) {
			return res.status(403).json({ message: 'Modification refusée' });
		}

		return res.json({ success: true });
	},

	// DELETE
	async delete(req: Request, res: Response) {
		const porteur_id = req.Utilisateur?.id;
		if (!porteur_id) return res.sendStatus(401);

		const success = await ProjetService.delete(Number(req.params.id), porteur_id);

		if (!success) {
			return res.status(403).json({ message: 'Suppression refusée' });
		}

		return res.json({ success: true });
	},
};
