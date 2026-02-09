import { StatCard } from "../StatCard";

export function Overview({ currentView, setCurrentView, stats, projects , Icons }) {
	return (
		<>
			<div className="space-y-8">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<StatCard
						currentView={currentView}
						setCurrentView={setCurrentView}
						title="Utilisateurs"
						value={stats.totalUsers}
						icon={Icons.Users}
						color="bg-blue-500"
					/>
					<StatCard
						currentView={currentView}
						setCurrentView={setCurrentView}
						title="Projets"
						value={stats.totalProjects}
						icon={Icons.Projects}
						color="bg-purple-500"
					/>
					<StatCard
						currentView={currentView}
						setCurrentView={setCurrentView}
						title="Fonds Récoltés"
						value={`${stats.totalFunds} €`}
						icon={Icons.Money}
						color="bg-green-500"
					/>
					<StatCard
						currentView={currentView}
						setCurrentView={setCurrentView}
						title="Campagnes Actives"
						value={stats.activeCampaigns}
						icon={Icons.Home}
						color="bg-orange-500"
					/>
				</div>

				{/* Recent Activity Section */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<h3 className="text-lg font-bold text-gray-800 mb-4">Derniers Projets</h3>
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="border-b border-gray-100 text-gray-500 text-sm">
									<th className="pb-3 font-medium">Titre</th>
									<th className="pb-3 font-medium">Porteur</th>
									<th className="pb-3 font-medium">Objectif</th>
									<th className="pb-3 font-medium">État</th>
									<th className="pb-3 font-medium text-center">Date de création</th>
								</tr>
							</thead>
							<tbody className="text-sm">
								{projects.slice(0, 5).map((p, idx) => (
									<tr key={p.id ? p.id : idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
										<td className="py-3 font-medium text-gray-800">
											<a href={`/cagnotte/${p.id}`}>{p.titre}</a>
										</td>
										<td className="py-3 text-gray-600">{p.porteur}</td>
										<td className="py-3 text-gray-600">
											{p.recolte}€ / {p.objectif}€
											<div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
												<div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${Math.min((p.recolte / p.objectif) * 100, 100)}%` }}></div>
											</div>
										</td>
										<td className="py-3">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													p.statut === 'publie' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
												}`}>
												{p.statut}
											</span>
										</td>
										<td className="py-3 text-gray-600 text-center">{new Date(p.date_creation).toLocaleDateString()}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}