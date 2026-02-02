import { useEffect, useState } from 'react';
import logo from '/BloomfundNoText.svg';
import { TabNavigation } from '../tabNavigation/tabNavigation';
import { useParams } from 'react-router-dom';
import { parseImages } from '../../helpers/image/parseImg.js';
import api from '../../helpers/request/api.js';
// Parse les images depuis le format JSON ou autres formats

function CagnottePageHero() {
	const { id } = useParams(); //  ID du projet
	const [projet, setProjet] = useState(null);

	useEffect(() => {
		const fetchProjet = async () => {
			try {
				const response = await api.get(`/projets/${id}`); // GET pour récupérer les projets
				setProjet(response.data);
			} catch (error) {
				console.error('Erreur lors de la récupération du projet :', error);
			}
		};
		fetchProjet();
	}, [id]);

	const [Contributions, setContributions] = useState([]);

	useEffect(() => {
		// http://localhost:3000/api/contributions/projet/1

		const fetchContribution = async () => {
			try {
				const response = await api.get(`/contributions/projet/${id}`); // GET pour récupérer les contributions
				setContributions(response.data);
			} catch (error) {
				console.error('Erreur lors de la récupération des contributions :', error);
			}
		};
		fetchContribution();
	}, [id]);

	if (!projet) {
		return (
			<div className="w-full h-screen flex justify-center items-center">
				<img src="/shared/loader.svg" alt="Loading..." />
			</div>
		);
	}

	const progress = projet && projet.objectif_financier > 0 ? (Number(projet.montant_collecte) / Number(projet.objectif_financier)) * 100 : 0;

	const dateFin = new Date(projet.date_fin);
	const aujourdHui = new Date();
	const diffMs = dateFin - aujourdHui;
	const diffJours = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

	// console.log(id);
	// console.log(projet);
	// console.log(Contributions);

	// const [Commentaires, setCommentaires] = useState([]);

	const images = parseImages(projet);
	// console.log('Parsed images:', images);

	return (
		<>
			<div className={'w-full bg h-175 flex justify-center items-center flex-col  bg-linear-to-b from-green-600 from-50% to-white to-50%'}>
				<div className={'w-4/6 h-fit py-2 bg-white shadow-2xl rounded-2xl'}>
					<div className={'flex flex-col items-center justify-center w-full m-6 gap-3'}>
						<h1 className={'text-2xl  '}>{projet ? projet.titre : 'titre'}</h1>
						{/* <p>{projet ? projet.description : 'Petite description'}</p> */}
					</div>
					<div className="flex flex-col lg:flex-row px-6 gap-10 justify-between items-start w-full">
						{/* COLONNE GAUCHE (60%) */}
						<div className="w-full lg:w-[60%] flex flex-col gap-4">
							<img className="w-full h-64 object-cover rounded-2xl" src={images.length > 0 ? images[0] : images} alt={projet?.titre} />

							{/* Infos Porteur */}
							<div className="flex flex-row gap-4 items-center py-2">
								<div className="w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold shrink-0">
									{projet?.porteur_prenom?.charAt(0)}
									{projet?.porteur_nom?.charAt(0)}
								</div>
								<div className="flex flex-col">
									<p className="font-semibold text-lg leading-tight">
										{projet?.porteur_prenom} {projet?.porteur_nom}
									</p>
									<div className="flex flex-row gap-4 text-sm text-gray-500 mt-1">
										<div className="flex items-center gap-1">
											<img className="w-4 h-4" src="/shared/pin.svg" alt="Localisation" />
											<span>{projet?.localisation}</span>
										</div>
										<div className="flex items-center gap-1">
											<img className="w-4 h-4" src="/shared/label.svg" alt="Catégorie" />
											<span>{projet?.categorie_nom}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full lg:w-[35%] flex flex-col gap-6 p-6 border border-gray-100 rounded-3xl shadow-xl bg-white top-10">
							<div className="flex flex-col gap-2 text-center lg:text-left">
								<div className="flex items-center gap-3 justify-center lg:justify-start">
									<img className="size-8 object-contain" src={logo} alt="Logo" />
									<p className="text-2xl font-bold text-gray-900">{projet ? projet.montant_collecte.split('.')[0] : '0'}€</p>
								</div>
								<p className="text-gray-500">
									collectés sur <span className="font-medium">{projet ? projet.objectif_financier.split('.')[0] : '0'}€</span>
								</p>
							</div>

							{/* Progress bar améliorée */}
							<div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-green-500 origin-left transition-transform duration-1000 ease-out"
									style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }}
								/>
							</div>

							<div className="flex flex-row w-full justify-between text-sm font-medium">
								<div className="flex flex-col items-center lg:items-start">
									<span className="text-gray-900">{Contributions.length}</span>
									<span className="text-gray-400 font-normal">contributions</span>
								</div>
								<div className="flex flex-col items-center lg:items-end">
									<span className="text-gray-900">{diffJours}</span>
									<span className="text-gray-400 font-normal">jours restants</span>
								</div>
							</div>

							<a
								href={`/payment/${projet ? projet.projet_id : ''}`}
								className="w-full bg-green-600 text-white py-4 px-4 rounded-2xl hover:bg-green-700 transition-all transform active:scale-95 shadow-lg shadow-green-100">
								<p className="font-bold text-lg">Contribuer</p>
								<p className="text-xs opacity-90 uppercase tracking-wide">À partir de 1€</p>
							</a>

							<div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								<p>Paiement 100% sécurisé</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full h-auto flex justify-center items-center mt-10 mb-10 ">
				<TabNavigation projet={projet} contributions={Contributions}></TabNavigation>
			</div>
		</>
	);
}
export default CagnottePageHero;
