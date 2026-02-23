export function Contribution({ contributions, visibleContributions, timeAgo, borderClass, showAll, setShowAll }) {
	return (
		<>
			<div className="w-full ">
				<h2 className="text-2xl">{contributions.length} Contributions</h2>

				<div className="my-6 flex flex-col  w-full">
					{visibleContributions.map((contribution, index) => {
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
									<p>Environ {timeAgo(contribution.date_contribution)}</p>
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
		</>
	);
}