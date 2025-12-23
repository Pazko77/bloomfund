import React from 'react';
import './CagnotteCard.scss';

const CagnotteCard = ({ image, titre, auteur, date, description }) => {
    return (
        <div className="cagnotte-card">
            <div className="cagnotte-card__image">
                <img src={image} alt={titre} />
            </div>

            <div className="cagnotte-card__content">
                <h3 className="cagnotte-card__titre">{titre}</h3>
                <p className="cagnotte-card__auteur">{auteur}</p>
                <p className="cagnotte-card__date">Date : {date}</p>

                <div className="cagnotte-card__description">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default CagnotteCard;