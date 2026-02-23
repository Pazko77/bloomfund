import { Request, Response } from "express";
import { ContrepartieService } from "../services/Contrepartie.service";

export const ContrepartieController = {
	// CREATE
	async create(req: Request, res: Response) {
		const porteur_id = req.Utilisateur?.id;
		if (!porteur_id) return res.sendStatus(401);

		const { projet_id } = req.body;
		if (!projet_id) {
			return res.status(400).json({ message: "projet_id est requis" });
		}

		try {
			const contrepartieId = await ContrepartieService.create(req.body);
			if (!contrepartieId) {
				return res.status(500).json({ message: "Erreur création contrepartie" });
			}

			return res.status(201).json({ success: true, id: contrepartieId });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	// READ ALL by projet
	async getByProjet(req: Request, res: Response) {
		try {
			const projet_id = Number(req.params.projetId);
			const contreparties = await ContrepartieService.findByProjetId(projet_id);
			return res.json(contreparties);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	// READ ONE
	async getOne(req: Request, res: Response) {
		try {
			const contrepartie = await ContrepartieService.findById(Number(req.params.id));
			if (!contrepartie) {
				return res.status(404).json({ message: "Contrepartie non trouvée" });
			}
			return res.json(contrepartie);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	// UPDATE
	async update(req: Request, res: Response) {
		const porteur_id = req.Utilisateur?.id;
		if (!porteur_id) return res.sendStatus(401);

		const { projet_id } = req.body;
		if (!projet_id) {
			return res.status(400).json({ message: "projet_id est requis" });
		}

		try {
			const success = await ContrepartieService.update(
				Number(req.params.id),
				projet_id,
				porteur_id,
				req.body
			);

			if (!success) {
				return res.status(403).json({ message: "Modification refusée" });
			}

			return res.json({ success: true });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	// DELETE
	async delete(req: Request, res: Response) {
		const porteur_id = req.Utilisateur?.id;
		if (!porteur_id) return res.sendStatus(401);

		const projet_id = Number(req.query.projet_id);
		if (!projet_id) {
			return res.status(400).json({ message: "projet_id est requis" });
		}

		try {
			const success = await ContrepartieService.delete(
				Number(req.params.id),
				projet_id,
				porteur_id
			);

			if (!success) {
				return res.status(403).json({ message: "Suppression refusée" });
			}

			return res.json({ success: true });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},
};
