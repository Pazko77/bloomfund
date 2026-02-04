export function projectsViews() {
    return (
			<>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
					<div className="text-gray-400 mb-4">
						<svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
						</svg>
					</div>
					<h3 className="text-xl font-bold text-gray-800">Gestion des Projets</h3>
					<p className="text-gray-500 mt-2">Cette section affichera la liste complète des projets avec options de modération.</p>
				</div>
			</>
		);
}