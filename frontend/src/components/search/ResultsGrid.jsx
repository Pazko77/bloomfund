import React from 'react';
import CagnotteCard from '../CagnotteCard/CagnotteCard.jsx';
const ResultsGrid = ({ filteredCagnottes }) => {
	return (
		<div className="rechercher_cardwrapper">
			{filteredCagnottes.length === 0 ? (
				<p>Aucune cagnotte trouvée.</p>
			) : (
				filteredCagnottes.map(item => (
					<CagnotteCard
						key={item.id}
						id={item.id}
						auteur={item.auteur}
						date={item.date}
						description={item.description}
						image={item.image}
						titre={item.titre}
						categorie={item.categorie}
					/>
				))
			)}
		</div>
	);
};

export default ResultsGrid;