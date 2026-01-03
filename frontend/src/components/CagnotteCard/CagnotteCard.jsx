import React from 'react';
import { Link } from 'react-router-dom';
import './CagnotteCard.scss';
import { getFirstImage } from '../../helpers/image/parseImg.js';
const CagnotteCard = ({ id, image, titre, auteur, date, description, categorie }) => {
	return (
		<Link to={`/cagnotte/${id}`} className="cagnotte-card-link ">
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
