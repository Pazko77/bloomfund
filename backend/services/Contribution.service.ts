import pool from "../config/db";
import { ContributionInput } from "../models/Contribution.model";

export const ContributionService = {
  // CREATE
  async create(data: ContributionInput): Promise<boolean> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Ajout contribution
      const insertContribution = `
				INSERT INTO Contributions (montant, utilisateur_id, projet_id)
				VALUES (?, ?, ?)
			`;

      await connection.execute(insertContribution, [
        data.montant,
        data.utilisateur_id,
        data.projet_id,
      ]);

      // 2. Mise à jour montant_collecte du projet
      const updateProjet = `
				UPDATE Projets
				SET montant_collecte = montant_collecte + ?
				WHERE id = ?
			`;

      await connection.execute(updateProjet, [data.montant, data.projet_id]);

      await connection.commit();
      return true;
    } catch (error) {
      return false;
    } finally {
      connection.release();
    }
  },

  // READ BY PROJET
  async findByProjet(projet_id: number) {
    const [rows] = await pool.query(
			`SELECT c.*, u.nom, u.prenom 
			 FROM Contributions c
			 JOIN Utilisateurs u ON u.id = c.utilisateur_id
			 WHERE c.projet_id = ?
			 ORDER BY c.date_contribution DESC`,
			[projet_id]
		);

    return rows;
  },


};
