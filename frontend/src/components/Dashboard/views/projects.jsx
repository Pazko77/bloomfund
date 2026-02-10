import { useState, useEffect } from 'react';
import { useAuth } from '../../../hook/useAuth';
import api from '../../../helpers/request/api';
import { decodeId } from '../../../helpers/encoder/hashId';

export function ProjectsViews({ projects }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState('');

	const { userCtx } = useAuth();
	const projectsPerPage = 10;

	const filteredProjects = projects.filter(project => {
		const searchLower = search.toLowerCase();
		return (
			project.titre?.toLowerCase().includes(searchLower) ||
			project.porteur?.toLowerCase().includes(searchLower) ||
			project.statut?.toLowerCase().includes(searchLower)
		);
	});

	const totalPages = Math.ceil(filteredProjects.length / projectsPerPage) || 1;

	const startIndex = (currentPage - 1) * projectsPerPage;
	const endIndex = startIndex + projectsPerPage;
	const projectsToShow = filteredProjects.slice(startIndex, endIndex);

	useEffect(() => {
		if (currentPage > totalPages) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCurrentPage(1);
		}
	}, [currentPage, totalPages]);

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<div className="flex justify-between items-center px-6 pt-6 pb-2">
				<input
					type="text"
					placeholder="Rechercher un projet..."
					value={search}
					onChange={e => {
						setSearch(e.target.value);
						setCurrentPage(1);
					}}
					className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
				/>
			</div>
			<table className="w-full text-left">
				<thead className="bg-gray-50">
					<tr className="text-gray-500 text-sm">
						<th className="px-6 py-4 font-medium">Titre</th>
						<th className="px-6 py-4 font-medium">Créateur</th>
						<th className="px-6 py-4 font-medium">Statut</th>
						<th className="px-6 py-4 font-medium">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{projectsToShow.length > 0 ? (
						projectsToShow.map(project => (
							<tr key={project.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium text-gray-900">{project.titre}</td>
								<td className="px-6 py-4 text-gray-600">{project.porteur}</td>
								<td className="px-6 py-4">
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${project.statut === 'publie' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
										{project.statut}
									</span>
								</td>
								<td className="px-3 py-4 flex gap-2">
									{userCtx?.role === 'admin' ? (
										<>
											<button
												type="button"
												onClick={async () => {
													const newStatus = project.statut === 'publie' ? 'brouillon' : 'publie';
													try {
														await api.put(`/projets/${decodeId(project.id)}`, { statut: newStatus });
														window.location.reload();
													} catch (err) {
														console.error(err);
													}
												}}
												className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition">
												{project.statut === 'publie' ? 'Dépublier' : 'Publier'}
											</button>
											<button
												type="button"
												onClick={async () => {
													if (!window.confirm('Confirmer la suppression du projet ?')) return;
													try {
														await api.delete(`/projets/${decodeId(project.id)}`);
														window.location.reload();
													} catch (err) {
														console.error(err);
														alert('Erreur lors de la suppression');
													}
												}}
												className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition">
												Supprimer
											</button>
										</>
									) : project.statut === 'publie' ? (
										<a href={`/cagnotte/${project.id}`}>
											<button className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition">Voir</button>
										</a>
									) : (
										<>
											<button className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition">
												Valider
											</button>
											|
											<button className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition">Supprimer</button>
										</>
									)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="5" className="text-center py-8 text-gray-400">
								Aucun projet trouvé.
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
	);
}
