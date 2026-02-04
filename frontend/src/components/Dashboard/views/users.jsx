export function usersViews({ users }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
								<table className="w-full text-left">
									<thead className="bg-gray-50">
										<tr className="text-gray-500 text-sm">
											<th className="px-6 py-4 font-medium">Nom</th>
											<th className="px-6 py-4 font-medium">Email</th>
											<th className="px-6 py-4 font-medium">Rôle</th>
											<th className="px-6 py-4 font-medium">Statut</th>
											<th className="px-6 py-4 font-medium text-right">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{users.map(user => (
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
												<td className="px-6 py-4 text-right space-x-2">
													<button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Éditer</button>
													<button className="text-red-600 hover:text-red-800 text-sm font-medium">Bannir</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
        </>
    );
}