import pool from '../config/db';
import { Projet, ProjetInput } from '../models/Projet.model';

export const ProjetService = {
	// CREATE
	 async create(data: ProjetInput, porteur_id: number): Promise<boolean> {
		const sql = `
			INSERT INTO Projets 
			(titre, description, objectif_financier, localisation, date_fin, porteur_id, categorie_id)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`;

		const params = [
			data.titre,
			data.description,
			data.objectif_financier,
			data.localisation ?? null,
			data.date_fin ?? null,
			porteur_id,
			data.categorie_id ?? null,
		];

		const [result]: any = await pool.execute(sql, params);
		return result.affectedRows === 1;
	},

	// READ ALL
	async findAll(): Promise<Projet[]> {
		const [rows] = await pool.query('SELECT * FROM Projets');
		return rows as Projet[];
	},

	// READ ONE
	 async findById(id: number): Promise<Projet | null> {
		const [rows]: any = await pool.query('SELECT * FROM Projets WHERE id = ?', [id]);
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
	}
}
