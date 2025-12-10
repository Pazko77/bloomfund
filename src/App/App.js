import './App.css';

import {BrowserRouter, Route, Routes} from "react-router-dom";
import Accueil from "../pages/Accueil/Accueil.js";
import Rechercher from "../pages/Rechercher/Rechercher.js";
import Connexion from "../pages/Connexion/Connexion.js";
import LayoutMain from "../layouts/LayoutMain/LayoutMain.js";
import About from "../pages/About/About.js";
import FormulaireCagnotte from "../pages/FormulaireCagnotte/FormulaireCagnotte";
import Inscription from "../pages/Inscription/Inscription";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayoutMain><Accueil/></LayoutMain>}/>
                <Route path="/about" element={<LayoutMain><About/></LayoutMain>}/>
                <Route path="/rechercher" element={<LayoutMain><Rechercher/></LayoutMain>}/>
                <Route path="/form" element={<LayoutMain><FormulaireCagnotte/></LayoutMain>}/>
                <Route path="/connexion" element={<Connexion/>}/>
                <Route path="/inscription" element={<Inscription/>}/>
            </Routes>
        </BrowserRouter>);
}

export default App;
