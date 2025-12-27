import { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../config/db';
import { Categorie, CategorieInput } from '../models/Categorie.model';

export const CategorieService = {


	async getAllCategories (): Promise<Categorie[]>  {
		try {
			const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM Categories ORDER BY nom');
			return rows as Categorie[];
		}catch (error) {
			console.error('Erreur lors de la récupération des catégories :', error);
			return [];
		}		
	},

	async getCategorieById (id: number): Promise<Categorie | null>  {
		try {
			const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM Categories WHERE id = ?', [id]);
			return rows.length ? (rows[0] as Categorie) : null;
		} catch (error) {
			console.error('Erreur lors de la récupération de la catégorie :', error);
			return null;
		}
	},

	async createCategorie (data: CategorieInput): Promise<number>  {
		try {
			const [result] = await db.query<ResultSetHeader>('INSERT INTO Categories (nom, description) VALUES (?, ?)', [
				data.nom,
				data.description ?? null,
			]);
			return result.insertId;
		} catch (error) {
			console.error('Erreur lors de la création de la catégorie :', error);
			throw error;
		}
	},

	async deleteCategorie  (id: number): Promise<boolean>  {
		try {
			const [result] = await db.query<ResultSetHeader>('DELETE FROM Categories WHERE id = ?', [id]);
			return result.affectedRows > 0;
		} catch (error) {
			console.error('Erreur lors de la suppression de la catégorie :', error);
			return false;
		}
	},

	async updateCategorie  (id: number, data: CategorieInput): Promise<boolean> {
		try {
			const [result] = await db.query<ResultSetHeader>('UPDATE Categories SET nom = ?, description = ? WHERE id = ?', [
				data.nom,
				data.description ?? null,
				id,
			]);
			return result.affectedRows > 0;
		}catch (error) {
			console.error('Erreur lors de la mise à jour de la catégorie :', error);
			return false;
		}
	}
}
