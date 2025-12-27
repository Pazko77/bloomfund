import './App.scss';
import { Routes, Route } from 'react-router-dom';
import About from '../pages/About/About.jsx';
import Accueil from '../pages/Accueil/Accueil.jsx';
import Connexion from '../pages/Connexion/Connexion.jsx';
import Inscription from '../pages/Inscription/Inscription.jsx';
import Rechercher from '../pages/Rechercher/Rechercher.jsx';
import Cagnotte from '../pages/FormulaireCagnotte/FormulaireCagnotte.jsx';
import LayoutMain from '../layouts/LayoutMain/LayoutMain.jsx';
import CagnottePageTemplate from "../pages/CagnottePageTemplate/CagnottePageTemplate.jsx";
function App() {
	return (
		<>
			<Routes>
				{/* Pages AVEC navbar */}
				<Route element={<LayoutMain />}>
					<Route path="/" element={<Accueil />} />
					<Route path="/accueil" element={<Accueil />} />
					<Route path="" element={<Accueil />} />
					<Route path="/about" element={<About />} />
					<Route path="/connexion" element={<Connexion />} />
					<Route path="/inscription" element={<Inscription />} />
					<Route path="/rechercher" element={<Rechercher />} />
					<Route path="/formCagnotte" element={<Cagnotte />} />
					<Route path="/cagnotte/:id" element={<CagnottePageTemplate />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
