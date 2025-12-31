import { useState, useEffect } from 'react';

export function TabNavigation({ projet, contributions, commentaires }) {
	// const [activeTab, setActiveTab] = useState('collecte');
	const [activeTab, setActiveTab] = useState('contributions');

	const tabs = [
		{ id: 'collecte', label: 'Collecte' },
		{ id: 'contreparties', label: 'Contreparties' },
		{ id: 'contributions', label: `Contributions ${contributions.length}` },
		{ id: 'commentaires', label: `Commentaires ${commentaires.length ?? 0}` },
	];

	const test = ['https://picsum.photos/800/400?1', 'https://picsum.photos/800/400?2'];

	const images = projet?.images?.length ? projet.images : projet?.image_url ? [projet.image_url] : [];

	images.push(...test);

	const [currentIndex, setCurrentIndex] = useState(0);

	console.log('Images for slider:', currentIndex);

	const nextImage = () => {
		setCurrentIndex(prev => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
	};

	useEffect(() => {
		if (images.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % images.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [images]);

	const [showAll, setShowAll] = useState(false); // pour gérer le bouton "Voir plus"

	const visibleContributions = showAll ? contributions : contributions.slice(0, 5);

	const borderClass = index => (index === visibleContributions.length - 1 ? 'border-b-2' : '');

	const renderContent = () => {
		switch (activeTab) {
			case 'collecte':
				return (
					<div className="">
						<h2 className="text-2xl">A propos de cette collecte</h2>
						<div className="my-6 flex flex-col ">
							{/* SLIDER */}
							<div className="relative w-5/6 h-96 overflow-hidden  bg-black">
								{images.length === 0 && (
									<img src="https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg" className="w-full h-full object-cover" />
								)}

								{images.map((img, index) => (
									<img
										key={index}
										src={img}
										alt={`Projet ${index}`}
										className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
					   
				`}
									/>
								))}

								{/* Boutons */}
								<button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full">
									←
								</button>

								<button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full">
									→
								</button>
							</div>
						</div>

						<div className=" w-5/6  ">
							<p className="text-left">{projet.description}</p>
						</div>
					</div>
				);
			case 'contreparties':
				return (
					<div className="bg-amber-500">
						<h2 className="text-2xl">Contreparties</h2>
						<div className="my-6 flex flex-col "></div>
					</div>
				);
			case 'contributions':
				return (
					<div className="w-full">
						<h2 className="text-2xl">{contributions.length} Contributions</h2>

						<div className="my-6 flex flex-col  w-full">
							{visibleContributions.map((contribution, index) => {
								const diffMs = new Date() - new Date(contribution.date_contribution);
								const diffMinutes = Math.round(diffMs / (1000 * 60));
								const diffHours = Math.round(diffMs / (1000 * 60 * 60));
								const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
								const diffMonths = Math.round(diffDays / 30);

								let timeAgo;
								if (diffMinutes < 60) timeAgo = `${diffMinutes} minutes`;
								else if (diffHours < 24) timeAgo = `${diffHours} heures`;
								else if (diffDays < 30) timeAgo = `${diffDays} jours`;
								else timeAgo = `${diffMonths} mois`;

								return (
									<div
										key={index}
										className={`border-r-2 border-t-2  border-l-2  border-gray-300 py-4 flex flex-row justify-between  ${borderClass(index)}`}>
										<div className="flex flex-row items-center  w-3/4">
											<img src="/shared/icon-contribution.svg" alt="icon-contribution" />
											<p>
												<span className="font-medium text-[#4c9a4e]">
													{contribution.prenom} {contribution.nom}
												</span>{' '}
												a contribué par un don de <span className="font-medium text-[#4c9a4e]">{contribution.montant.split('.')[0]}€</span>
											</p>
										</div>
										<div className="flex items-center justify-end w-1/4 mr-10">
											<p>Environ {timeAgo}</p>
										</div>
									</div>
								);
							})}
						</div>

						{contributions.length > 5 && (
							<div className="flex justify-center mt-4">
								<button
									className="upper border-2 border-[#4c9a4e] text-[#4c9a4e] px-10 py-4 inline-block text-center   "
									onClick={() => setShowAll(!showAll)}>
									{showAll ? 'Voir moins' : 'Voir plus'}
								</button>
							</div>
						)}
					</div>
				);
			case 'commentaires':
				return (
					<div className="bg-amber-500">
						<h2 className="text-2xl">Commentaires</h2>
					</div>
				);
		}
	};

	return (
		<div className="w-full flex flex-col  items-center ">
			{/* Navigation Tabs */}
			<div className="border-b border-gray-200 w-full ">
				<nav className="flex gap-8 w-full justify-start  px-80">
					{tabs.map(tab => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`relative pb-4 transition-colors ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
							{tab.label}
							{activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
						</button>
					))}
				</nav>
			</div>

			{/* Content Area */}
			<div className="w-full flex flex-row py-10 px-80 gap-10">
				<div className=" w-3/4 flex  items-center">{renderContent()}</div>
				<div className="w-1/4 flex flex-col items-center justify-start">
					<div className="w-80 h-40 border-2 border-[#b8afa4] flex items-center justify-center flex-col gap-4 ">
						<p className="text-center">Soutenez la collecte et recevez des contreparties en échange.</p>
						<a href="#" className="upper border-2 border-[#4c9a4e] px-10 py-4 inline-block text-center   ">
							Voir les Contreparties
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
