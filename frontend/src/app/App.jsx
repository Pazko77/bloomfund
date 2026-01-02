import "./App.scss";
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
import LayoutMain from "../layouts/LayoutMain/LayoutMain.jsx";

// Lazy loading des pages
const About = lazy(() => import("../pages/About/About.jsx"));
const Accueil = lazy(() => import("../pages/Accueil/Accueil.jsx"));
const Connexion = lazy(() => import("../pages/Connexion/Connexion.jsx"));
const Inscription = lazy(() => import("../pages/Inscription/Inscription.jsx"));
const Rechercher = lazy(() => import("../pages/Rechercher/Rechercher.jsx"));
const Cagnotte = lazy(() => import("../pages/FormulaireCagnotte/FormulaireCagnotte.jsx"));
const CagnottePageTemplate = lazy(() => import("../pages/CagnottePageTemplate/CagnottePageTemplate.jsx"));
const Profil = lazy(() => import("../pages/Profil/Profil.jsx"));

// Composant Loader
const Loader = () => (
	<div className="w-full h-screen flex justify-center items-center">
		<img src="/shared/loader.svg" alt="Loading..." />
	</div>
);

function App() {
  return (
		<Suspense fallback={<Loader />}>
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
					<Route path="/profil" element={<Profil />} />
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
