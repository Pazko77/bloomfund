import pool from "../config/db";
import { Contrepartie, ContrepartieInput } from "../models/Contrepartie.model";

export const ContrepartieService = {
	// CREATE
	async create(data: ContrepartieInput): Promise<number | null> {
		const sql = `
			INSERT INTO Contreparties 
			(titre, description, montant_minimum, type, quantite_disponible, quantite_restante, date_livraison_estimee, image_url, projet_id)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		const params = [
			data.titre,
			data.description,
			data.montant_minimum,
			data.type,
			data.quantite_disponible ?? null,
			data.quantite_disponible ?? null, // quantite_restante = quantite_disponible at creation
			data.date_livraison_estimee ?? null,
			data.image_url ?? null,
			data.projet_id,
		];

		const [result]: any = await pool.execute(sql, params);
		if (result.affectedRows === 1) {
			return result.insertId;
		}
		return null;
	},

	// READ ALL by projet
	async findByProjetId(projet_id: number): Promise<Contrepartie[]> {
		const [rows] = await pool.query(
			`SELECT * FROM Contreparties WHERE projet_id = ? ORDER BY montant_minimum ASC`,
			[projet_id]
		);
		return rows as Contrepartie[];
	},

	// READ ONE
	async findById(id: number): Promise<Contrepartie | null> {
		const [rows]: any = await pool.query(
			`SELECT * FROM Contreparties WHERE id = ?`,
			[id]
		);
		return rows[0] || null;
	},

	// UPDATE
	async update(id: number, projet_id: number, porteur_id: number, data: Partial<ContrepartieInput>): Promise<boolean> {
		// Vérifier que la contrepartie appartient bien au projet du porteur
		const [check]: any = await pool.query(
			`SELECT c.id FROM Contreparties c 
			 INNER JOIN Projets p ON c.projet_id = p.id 
			 WHERE c.id = ? AND c.projet_id = ? AND p.porteur_id = ?`,
			[id, projet_id, porteur_id]
		);

		if (!check[0]) return false;

		const fields = Object.keys(data)
			.map(key => `${key} = ?`)
			.join(', ');
		const values = Object.values(data);

		if (!fields) return false;

		values.push(id);

		const sql = `UPDATE Contreparties SET ${fields} WHERE id = ?`;

		const [result]: any = await pool.execute(sql, values);
		return result.affectedRows === 1;
	},

	// DELETE
	async delete(id: number, projet_id: number, porteur_id: number): Promise<boolean> {
		// Vérifier que la contrepartie appartient bien au projet du porteur
		const [check]: any = await pool.query(
			`SELECT c.id FROM Contreparties c 
			 INNER JOIN Projets p ON c.projet_id = p.id 
			 WHERE c.id = ? AND c.projet_id = ? AND p.porteur_id = ?`,
			[id, projet_id, porteur_id]
		);

		if (!check[0]) return false;

		const [result]: any = await pool.execute(
			'DELETE FROM Contreparties WHERE id = ?',
			[id]
		);

		return result.affectedRows === 1;
	},

	// Decrement quantity when someone claims a contrepartie
	async decrementQuantity(id: number): Promise<boolean> {
		const [result]: any = await pool.execute(
			`UPDATE Contreparties 
			 SET quantite_restante = quantite_restante - 1 
			 WHERE id = ? AND (quantite_restante IS NULL OR quantite_restante > 0)`,
			[id]
		);
		return result.affectedRows === 1;
	},
};
