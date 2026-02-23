import React from 'react';

const Filters = ({
	selectedCategory,
	setSelectedCategory,
	selectedLocation,
	setSelectedLocation,
	selectedSort,
	setSelectedSort,
	showCategoryDropdown,
	setShowCategoryDropdown,
	showLocationDropdown,
	setShowLocationDropdown,
	showSortDropdown,
	setShowSortDropdown,
	categories,
	locationQuery,
	setLocationQuery,
	locationSuggestions,
	isLocationOpen,
	setIsLocationOpen,
	isLocationLoading,
	locationSelectedIndex,
	setLocationSelectedIndex,
	handleLocationSelect,
	handleLocationKeyDown,
	categoryRef,
	locationRef,
	sortRef,
	sortOptions,
}) => {
	return (
		<div className="rechercher_filters">
			{/* Filtre Catégories */}
			<div className="rechercher_filtergroup">
				<label className="rechercher_filterlabel">Filtre :</label>
				<div className="rechercher_filterdropdown" ref={categoryRef}>
					<button className="rechercher_filterbutton" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
						{selectedCategory}
						<svg className="rechercher_filterarrow" width="12" height="12" viewBox="0 0 12 12">
							<path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
					{selectedCategory !== 'Catégories' && (
						<button className="rechercher_filterclear" onClick={() => setSelectedCategory('Catégories')} title="Supprimer le filtre">
							×
						</button>
					)}
					{showCategoryDropdown && (
						<div className="rechercher_filtermenu">
							{categories.map(cat => (
								<div
									key={cat}
									className="rechercher_filteroption"
									onClick={() => {
										setSelectedCategory(cat);
										setShowCategoryDropdown(false);
									}}>
									{cat}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Filtre Lieu avec recherche séparée */}
			<div className="rechercher_filtergroup">
				<label className="rechercher_filterlabel">Lieu :</label>
				<div className="rechercher_filterdropdown" ref={locationRef}>
					<button className="rechercher_filterbutton" onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
						{selectedLocation}
						<svg className="rechercher_filterarrow" width="12" height="12" viewBox="0 0 12 12">
							<path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
					{selectedLocation !== 'Villes/Dep' && (
						<button className="rechercher_filterclear" onClick={() => setSelectedLocation('Villes/Dep')} title="Supprimer le filtre">
							×
						</button>
					)}
					{showLocationDropdown && (
						<div className="rechercher_filtermenu location">
							<div className="rechercher_filtersearch">
								<input
									type="text"
									placeholder="Rechercher une ville ou département..."
									value={locationQuery}
									onChange={e => setLocationQuery(e.target.value)}
									onKeyDown={handleLocationKeyDown}
									onFocus={() => locationSuggestions.length > 0 && setIsLocationOpen(true)}
								/>
								{isLocationLoading && (
									<div className="rechercher_locationspinner">
										<div className="spinner"></div>
									</div>
								)}
							</div>

							{isLocationOpen && locationSuggestions.length > 0 && (
								<div className="rechercher_locationresults">
									{locationSuggestions.map((suggestion, index) => (
										<div
											key={`${suggestion.type}-${suggestion.code}`}
											className={`rechercher_filteroption ${index === locationSelectedIndex ? 'selected' : ''}`}
											onClick={() => handleLocationSelect(suggestion)}
											onMouseEnter={() => setLocationSelectedIndex(index)}>
											<div className="rechercher_filteroptionmain">
												{suggestion.nom}
												<span className={`rechercher_filterbadge ${suggestion.type}`}>{suggestion.type === 'ville' ? 'Ville' : 'Dép.'}</span>
											</div>
											<div className="rechercher_filteroptionsub">{suggestion.subText}</div>
										</div>
									))}
								</div>
							)}

							{isLocationOpen && !isLocationLoading && locationSuggestions.length === 0 && locationQuery.length >= 2 && (
								<div className="rechercher_locationresults">
									<div className="rechercher_filteroption empty">Aucun résultat trouvé</div>
								</div>
							)}

							{!isLocationOpen && locationQuery.length < 2 && <div className="rechercher_filteroption empty">Tapez au moins 2 caractères...</div>}
						</div>
					)}
				</div>
			</div>

			{/* Filtre Tri */}
			<div className="rechercher_filtergroup">
				<label className="rechercher_filterlabel">Tri :</label>
				<div className="rechercher_filterdropdown" ref={sortRef}>
					<button className="rechercher_filterbutton" onClick={() => setShowSortDropdown(!showSortDropdown)}>
						{selectedSort}
						<svg className="rechercher_filterarrow" width="12" height="12" viewBox="0 0 12 12">
							<path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
					{showSortDropdown && (
						<div className="rechercher_filtermenu">
							{sortOptions.map(option => (
								<div
									key={option}
									className="rechercher_filteroption"
									onClick={() => {
										setSelectedSort(option);
										setShowSortDropdown(false);
									}}>
									{option}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Filters;