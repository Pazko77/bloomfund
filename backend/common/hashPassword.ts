import bcrypt from 'bcrypt';

/**
 * hash
 *
 * @async
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashP = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 10);
};
