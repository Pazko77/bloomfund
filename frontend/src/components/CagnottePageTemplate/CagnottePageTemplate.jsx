import React from "react";
import { useParams } from 'react-router-dom';
import './CagnottePageTemplate.scss';



const CagnottePageTemplate = () => {
    const { id } = useParams();
    return (
        <div className="cagnotte-page">
            <h1>Détails de la cagnotte n°{id}</h1>
            <p>Ici, on affichera les infos du projet ayant l'ID : {id}</p>
        </div>
    );
}

export default CagnottePageTemplate;