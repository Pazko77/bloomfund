
export function Collecte({ projet, images, prevImage, nextImage, currentIndex }) {


	return (
		<div className="">
			<h2 className="text-2xl">A propos de cette collecte</h2>
			<div className="my-6 flex flex-col ">
				{/* SLIDER */}
				<div className="relative w-5/6 h-96 overflow-hidden  bg-black">
					<img src={images[currentIndex]} alt="Projet" className="w-full h-full object-cover transition-opacity duration-500" />

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
}