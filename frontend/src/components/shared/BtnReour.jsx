import { useNavigate } from 'react-router-dom';
export function BtnRetour({ text = 'Retour à la ',  lien = '' }) {
	const navigate = useNavigate();

    return (
			<button
				onClick={() => navigate(`${lien}`)}
				className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fillRule="evenodd"
						d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
						clipRule="evenodd"
					/>
				</svg>
				{text}
			</button>
		);
}