import React from "react";
//import { useParams } from 'react-router-dom';
import CagnottePageHero from "../../components/CagnottePageHero/CagnottePageHero.jsx";
import "./CagnottePageTemplate.scss";

const CagnottePageTemplate = () => {
  //const { id } = useParams();
  return (
    <div className="pt-20">
      <CagnottePageHero />
    </div>
  );
};

export default CagnottePageTemplate;
