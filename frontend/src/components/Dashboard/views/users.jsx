import { useState } from 'react';
export function UsersViews({ users }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState('');
	const usersPerPage = 10;

	const filteredUsers = users.filter(user => {
		const searchLower = search.toLowerCase();
		return (
			user.nom?.toLowerCase().includes(searchLower) ||
			user.prenom?.toLowerCase().includes(searchLower) ||
			user.email?.toLowerCase().includes(searchLower)
		);
	});

	const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
	const startIndex = (currentPage - 1) * usersPerPage;
	const endIndex = startIndex + usersPerPage;
	const usersToShow = filteredUsers.slice(startIndex, endIndex);

	// Reset page if search changes and current page is out of range
	if (currentPage > totalPages) {
		setCurrentPage(1);
	}

	return (
		<>
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="flex justify-start px-6 pt-6 pb-2">
					<input
						type="text"
						placeholder="Rechercher un utilisateur..."
						value={search}
						onChange={e => {
							setSearch(e.target.value);
							setCurrentPage(1);
						}}
						className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 text-sm"
					/>
				</div>
				<table className="w-full text-left">
					<thead className="bg-gray-50">
						<tr className="text-gray-500 text-sm">
							<th className="px-6 py-4 font-medium">Nom</th>
							<th className="px-6 py-4 font-medium">Email</th>
							<th className="px-6 py-4 font-medium">Rôle</th>
							<th className="px-6 py-4 font-medium">Statut</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{usersToShow.length > 0 ? (
							usersToShow.map(user => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div className="font-medium text-gray-900">
											{user.prenom} {user.nom}
										</div>
									</td>
									<td className="px-6 py-4 text-gray-600">{user.email}</td>
									<td className="px-6 py-4">
										<span
											className={`px-2 py-1 rounded text-xs font-medium ${
												user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
											}`}>
											{user.role}
										</span>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
												user.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
											}`}>
											<span className={`w-1.5 h-1.5 rounded-full ${user.status === 'actif' ? 'bg-green-500' : 'bg-red-500'}`}></span>
											{user.status}
										</span>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="4" className="text-center py-8 text-gray-400">
									Aucun utilisateur trouvé.
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<div className="flex justify-between items-center mt-6 px-6 py-4">
					<div>
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage(currentPage - 1)}
							className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-150
							${currentPage === 1 ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-green-700'}`}>
							Précédent
						</button>
					</div>
					<div>
						<span className="mx-2 text-gray-600 text-sm select-none">
							Page <span className="font-semibold text-green-700">{currentPage}</span> sur <span className="font-semibold">{totalPages}</span>
						</span>
					</div>
					<div>
						<button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage(currentPage + 1)}
							className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-150
							${currentPage === totalPages ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-green-700'}`}>
							Suivant
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
