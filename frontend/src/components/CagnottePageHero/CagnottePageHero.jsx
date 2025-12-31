import { useEffect, useState } from 'react';
import logo from '/BloomfundNoText.svg';
import { TabNavigation } from '../tabNavigation/tabNavigation';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CagnottePageHero() {
	const { id } = useParams(); //  ID du projet
	const [projet, setProjet] = useState(null);

	useEffect(() => {
		const fetchProjet = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/projets/${id}`); // GET pour récupérer les projets
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
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/contributions/projet/${id}`); // GET pour récupérer les contributions
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
	const diffMs = aujourdHui - dateFin;
	const diffJours = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

	// console.log(id);
	// console.log(projet);
	// console.log(Contributions);

	// const [Commentaires, setCommentaires] = useState([]);

	return (
		<>
			<div className={'w-full bg h-175 bg-red-400 flex justify-center items-center flex-col  bg-linear-to-b from-green-600 from-50% to-white to-50%'}>
				<div className={'w-4/6 h-4/5 bg-white shadow-2xl rounded-2xl'}>
					<div className={'flex flex-col items-center justify-center w-full m-6 gap-3'}>
						<h1 className={'text-2xl  '}>{projet ? projet.titre : 'titre'}</h1>
						{/* <p>{projet ? projet.description : 'Petite description'}</p> */}
					</div>
					<div className={'flex flex-row px-6 gap-3'}>
						<img
							className={`w-140 rounded-2xl transition-opacity duration-500 `}
							src={projet?.image_url || 'https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg'}
							alt={projet?.titre}
						/>

						<div className={'flex flex-col w-full items-center justify-center gap-3'}>
							<div className={'flex flex-row items-center gap-3'}>
								<img className={'size-10'} src={`${logo}`} />
								<p className="text-xl">
									{projet ? projet.montant_collecte.split('.')[0] : '0'}€ collectés sur {projet ? projet.objectif_financier.split('.')[0] : '0'}€
								</p>
							</div>
							{/* Progress bar*/}
							<div className="w-full h-5 border-2 border-black rounded-2xl overflow-hidden bg-gray-100">
								<div
									className="h-full w-full bg-green-600 rounded-3xl origin-left transition-transform duration-1000 ease-out"
									style={{ transform: `scaleX(${progress / 100})` }}
								/>
							</div>

							<div className={'flex flex-row w-full justify-around'}>
								<p className={''}>{Contributions.length} contributions</p>

								<p className={''}>{diffJours} jours restants</p>
							</div>
							<div>
								<button className={'w-full bg-green-600 text-white py-4 px-4 rounded-2xl hover:bg-green-700 transition-colors duration-300'}>
									<p>Contribuer</p>
									<p>A partir de 1€</p>
								</button>
							</div>
							<p>Paiement sécurisé</p>
						</div>
					</div>
					<div className={'flex flex-row gap-3 p-6'}>
						<img className={'w-12 rounded-full hover:scale-75'} src="https://i.pravatar.cc/300" />
						<div className={'flex flex-col'}>
							<p>
								{projet.porteur_prenom} {projet.porteur_nom}
							</p>
							<div className={'flex flex-row gap-3'}>
								<img className={'w-3.75 '} src="/shared/pin.svg" />
								<p>{projet.localisation}</p>
								<img className={'w-3.75'} src="/shared/label.svg" />
								<p>{projet.categorie_nom}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full h-auto flex justify-center items-center mt-10 mb-10 ">
				<TabNavigation projet={projet} contributions={Contributions} commentaires={0}></TabNavigation>
			</div>
		</>
	);
}
export default CagnottePageHero;
