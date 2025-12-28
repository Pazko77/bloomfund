import pool from "../config/db";
import { Utilisateur, UtilisateurInput } from "../models/Utilisateur.model.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const UtilisateurService = {
  /**
   * Crée un nouvel utilisateur dans la base de données.
   *
   * @param {UtilisateurInput} data - Les informations de l'utilisateur à créer.
   * @returns {Promise<Utilisateur | null>} - L'utilisateur créé ou null en cas d'erreur.
   */
  async create(data: UtilisateurInput): Promise<Utilisateur | null> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO Utilisateurs (nom, prenom, email, mot_de_passe, role, date_inscription , departement) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
        [
          data.nom,
          data.prenom,
          data.email,
          data.mot_de_passe,
          "citoyen",
          data.departement,
        ],
      );

      const insertId = result.insertId;

      return {
        id: insertId,
        ...data,
        date_inscription: new Date(),
      };
    } catch (error) {
      console.error("Erreur create utilisateur:", error);
      return null;
    }
  },

  /**
   * Récupère un utilisateur à partir de son email.
   *
   * @param {string} email - L'email de l'utilisateur à rechercher.
   * @returns {Promise<Utilisateur | null>} - L'utilisateur trouvé ou null si inexistant.
   */
  async findByEmail(email: string): Promise<Utilisateur | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Utilisateurs WHERE email = ?",
        [email],
      );
      return (rows[0] as Utilisateur) || null;
    } catch (error) {
      console.error("Erreur findByEmail:", error);
      return null;
    }
  },
  /**
   * Récupère un utilisateur à partir de son id.
   *
   * @param {number} id - L'id de l'utilisateur à rechercher.
   * @returns {Promise<Utilisateur | null>} - L'utilisateur trouvé ou null si inexistant.
   */

  async findById(id: number): Promise<Utilisateur | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Utilisateurs WHERE id = ?",
        [id],
      );
      return (rows[0] as Utilisateur) || null;
    } catch (error) {
      console.error("Erreur findById:", error);
      return null;
    }
  },

  /**
   * Récupère un utilisateur à partir de son id.
   *
   * @param {number} id - L'id de l'utilisateur à rechercher.
   * @returns {Promise<Utilisateur | null>} - L'utilisateur trouvé ou null si inexistant.
   */

  async update(id: number, data: Partial<Utilisateur>): Promise<boolean> {
    try {
      const keys = Object.keys(data);
      if (keys.length === 0) return false;

      const fields = keys.map((key) => `${key} = ?`).join(", ");
      const values = Object.values(data);
      values.push(id);

      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE Utilisateurs SET ${fields} WHERE id = ?`,
        values,
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erreur update utilisateur:", error);
      return false;
    }
  },
  /**
   * Supprime un utilisateur de la base de données.
   *
   * @param {number} id - L'id de l'utilisateur à supprimer.
   * @returns {Promise<boolean>} - true si la suppression a réussi, false sinon.
   */
  async delete(id: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM Utilisateurs WHERE id = ?",
        [id],
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erreur delete utilisateur:", error);
      return false;
    }
  },
};
