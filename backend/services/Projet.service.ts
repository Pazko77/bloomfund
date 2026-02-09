import pool from "../config/db";
import { Projet, ProjetInput } from "../models/Projet.model";

export const ProjetService = {
	// CREATE
	async create(data: ProjetInput, porteur_id: number): Promise<number | null> {
		const sql = `
			INSERT INTO Projets 
			(titre, description, objectif_financier, localisation, date_fin, porteur_id, categorie_id , image_url)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`;

		const params = [
			data.titre,
			data.description,
			data.objectif_financier,
			data.localisation ?? null,
			data.date_fin ?? null,
			porteur_id,
			data.categorie_id ?? null,
			data.image_url ?? null,
		];

		const [result]: any = await pool.execute(sql, params);
		if (result.affectedRows === 1) {
			return result.insertId;
		}
		return null;
	},

	// READ ALL
	async findAll(statut?: string): Promise<Projet[]> {
		const [rows] = await pool.query(
			`SELECT 
      Projets.id AS projet_id,
      Projets.titre,
      Projets.description,
      Projets.objectif_financier,
      Projets.montant_collecte,
      Projets.statut,
      Projets.date_creation,
      Projets.date_fin,
      Projets.image_url,
      Projets.localisation,
      Utilisateurs.nom AS porteur_nom,
      Utilisateurs.prenom AS porteur_prenom,
      Utilisateurs.departement AS porteur_departement,
      Categories.nom AS categorie_nom,
      Categories.description AS categorie_description
     FROM Projets
     INNER JOIN Utilisateurs ON Projets.porteur_id = Utilisateurs.id
     LEFT JOIN Categories ON Projets.categorie_id = Categories.id`
	 + (statut ? ' WHERE Projets.statut = ?' : ''),
			statut ? [statut] : []
		);

		return rows as Projet[];
	},

	// READ ONE
	async findById(id: number): Promise<Projet | null> {
		const [rows]: any = await pool.query(
			`SELECT 
      Projets.id AS projet_id,
      Projets.titre,
      Projets.description,
      Projets.objectif_financier,
      Projets.montant_collecte,
      Projets.statut,
      Projets.date_creation,
      Projets.date_fin,
      Projets.image_url,
      Projets.localisation,
      Utilisateurs.nom AS porteur_nom,
      Utilisateurs.prenom AS porteur_prenom,
      Utilisateurs.departement AS porteur_departement,
      Categories.nom AS categorie_nom,
      Categories.description AS categorie_description
     FROM Projets
     INNER JOIN Utilisateurs ON Projets.porteur_id = Utilisateurs.id
     LEFT JOIN Categories ON Projets.categorie_id = Categories.id 
     WHERE Projets.id = ?`,
			[id]
		);
		return rows[0] || null;
	},

	// UPDATE
	async update(id: number, porteur_id: number, data: Partial<ProjetInput>): Promise<boolean> {
		const fields = Object.keys(data)
			.map(key => `${key} = ?`)
			.join(', ');
		const values = Object.values(data);

		if (!fields) return false;

		values.push(id, porteur_id);

		const sql = `
			UPDATE Projets 
			SET ${fields}
			WHERE id = ? AND porteur_id = ?
		`;

		const [result]: any = await pool.execute(sql, values);
		return result.affectedRows === 1;
	},

	// DELETE
	async delete(id: number, porteur_id: number): Promise<boolean> {
		const [result]: any = await pool.execute('DELETE FROM Projets WHERE id = ? AND porteur_id = ?', [id, porteur_id]);

		return result.affectedRows === 1;
	},
};
