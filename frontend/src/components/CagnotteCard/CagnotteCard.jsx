// CagnotteCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './CagnotteCard.scss';
import { getFirstImage } from '../../helpers/image/parseImg.js';
import { encodeId } from '../../helpers/hashId.js';

const CagnotteCard = ({ id, image, titre, auteur, date, description, categorie }) => {
	const hashId = encodeId(id);
	return (
		// AJOUT de la classe 'cagnotte-card-wrapper' ici
		<Link to={`/cagnotte/${hashId}`} className="cagnotte-card-link cagnotte-card-wrapper">
			<div className="cagnotte-card flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
				<div className="cagnotte-card__image">
					<img src={getFirstImage(image)} alt={titre} />
				</div>

				<div className="cagnotte-card__content w-100">
					<h3 className="cagnotte-card__titre">{titre}</h3>
					<p className="cagnotte-card__auteur">{auteur}</p>
					<p className="cagnotte-card__date">Date : {date}</p>
					<div className="cagnotte-card__description">
						{description} <br />
						------------ <br />
						{categorie}
					</div>
				</div>
			</div>
		</Link>
	);
};

export default CagnotteCard;