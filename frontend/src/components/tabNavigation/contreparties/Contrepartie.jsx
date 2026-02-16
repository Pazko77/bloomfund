import { useState } from 'react';

// Composant pour gérer les images avec état de chargement et fallback
function ContrepartieImage({ src, alt, type }) {
	const [imageState, setImageState] = useState('loading'); // 'loading' | 'loaded' | 'error'

	const handleLoad = () => setImageState('loaded');
	const handleError = () => setImageState('error');

	// Placeholder par défaut si pas d'image ou erreur
	const renderPlaceholder = () => (
		<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
			<div className="text-center">
				<div className="w-16 h-16 mx-auto mb-2 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
					{type === 'physique' ? (
						<svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							/>
						</svg>
					) : (
						<svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					)}
				</div>
				<span className="text-xs text-gray-400">{type === 'physique' ? 'Produit physique' : 'Contenu digital'}</span>
			</div>
		</div>
	);

	if (!src) {
		return <div className="relative h-56 overflow-hidden">{renderPlaceholder()}</div>;
	}

	return (
		<div className="relative  overflow-hidden bg-gray-100">
			{/* Skeleton loader pendant le chargement */}
			{imageState === 'loading' && (
				<div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
					<svg className="w-10 h-10 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				</div>
			)}

			{/* Fallback en cas d'erreur */}
			{imageState === 'error' && renderPlaceholder()}

			{/* Image réelle */}
			<img
				src={src}
				alt={alt}
				className={`w-full h-full object-cover transition-opacity duration-300 ${imageState === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
				onLoad={handleLoad}
				onError={handleError}
			/>

			{/* Overlay gradient */}
			{imageState === 'loaded' && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />}
		</div>
	);
}

export function Contrepartie({ contreparties = [] }) {
	if (contreparties.length === 0) {
		return (
			<div className="w-full">
				<div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-dashed border-gray-300">
					<div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
						<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-600 mb-2">Aucune contrepartie disponible</h3>
					<p className="text-gray-400 text-sm">Ce projet ne propose pas encore de contreparties.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="mb-6">
				<p className="text-gray-500 text-sm">Soutenez ce projet et recevez des récompenses exclusives en échange de votre contribution.</p>
			</div>

			<div className="grid gap-5">
				{contreparties.map((contrepartie, index) => (
					<div
						key={contrepartie.id}
						className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-green-400 hover:shadow-lg transition-all duration-300">
						{/* Bandeau prix */}
						<div className="absolute top-4 right-4 z-10">
							<div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-lg">
								<span className="text-xl font-bold">{contrepartie.montant_minimum}€</span>
								<span className="text-xs opacity-80 ml-1">min</span>
							</div>
						</div>

						{/* Image de la contrepartie */}
						<ContrepartieImage src={contrepartie.image_url} alt={contrepartie.titre} type={contrepartie.type} />

						<div className="p-6">
							{/* Header */}
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Niveau {index + 1}</span>
										<span
											className={`px-2 py-0.5 text-xs font-medium rounded-full ${
												contrepartie.type === 'physique'
													? 'bg-blue-50 text-blue-600 border border-blue-200'
													: 'bg-amber-50 text-amber-600 border border-amber-200'
											}`}>
											{contrepartie.type === 'physique' ? '📦 Physique' : '🌐 Digital'}
										</span>
									</div>
									<h3 className="text-xl font-bold text-gray-900">{contrepartie.titre}</h3>
								</div>
							</div>

							{/* Description */}
							<p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">{contrepartie.description}</p>

							{/* Infos supplémentaires */}
							<div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
								{contrepartie.quantite_disponible && (
									<div className="flex items-center gap-2 text-sm">
										<div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
											<svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
												/>
											</svg>
										</div>
										<div>
											<span className="text-gray-400 text-xs">Stock</span>
											<p className="font-semibold text-gray-700">
												{contrepartie.quantite_restante ?? contrepartie.quantite_disponible}
												<span className="text-gray-400 font-normal">/{contrepartie.quantite_disponible}</span>
											</p>
										</div>
									</div>
								)}

								{contrepartie.date_livraison_estimee && (
									<div className="flex items-center gap-2 text-sm">
										<div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
											<svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<div>
											<span className="text-gray-400 text-xs">Livraison estimée</span>
											<p className="font-semibold text-gray-700">
												{new Date(contrepartie.date_livraison_estimee).toLocaleDateString('fr-FR', {
													month: 'long',
													year: 'numeric',
												})}
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Barre de progression du stock */}
							{contrepartie.quantite_disponible && (
								<div className="mt-4">
									<div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
											style={{
												width: `${((contrepartie.quantite_restante ?? contrepartie.quantite_disponible) / contrepartie.quantite_disponible) * 100}%`,
											}}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
