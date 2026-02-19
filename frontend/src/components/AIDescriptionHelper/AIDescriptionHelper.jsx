import { useState } from 'react';
import PropTypes from 'prop-types';
import './AIDescriptionHelper.scss';
import api from '../../helpers/request/api';

export default function AIDescriptionHelper({ 
	titre, 
	categorie, 
	currentDescription, 
	onApplyDescription,
	objectifFinancier 
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [suggestion, setSuggestion] = useState('');
	const [error, setError] = useState('');
	const [promptType, setPromptType] = useState('complete'); // 'complete', 'improve', 'expand'

	const generateDescription = async () => {
		if (!titre.trim()) {
			setError('Veuillez d\'abord renseigner un titre pour votre projet');
			return;
		}

		setIsLoading(true);
		setError('');
		setSuggestion('');

		try {
			const response = await api.post('/ai/generate-description', {
				titre,
				categorie,
				currentDescription,
				objectifFinancier,
				promptType
			});

			setSuggestion(response.data.description);
		} catch (err) {
			console.error('Erreur génération IA:', err);
			setError(
				err.response?.data?.message || 
				'Une erreur est survenue lors de la génération. Veuillez réessayer.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleApply = () => {
		onApplyDescription(suggestion);
		setIsOpen(false);
		setSuggestion('');
	};

	const handleAppend = () => {
		const newDescription = currentDescription 
			? `${currentDescription}\n\n${suggestion}` 
			: suggestion;
		onApplyDescription(newDescription);
		setIsOpen(false);
		setSuggestion('');
	};

	return (
		<div className="ai-helper">
			<button
				type="button"
				className="ai-helper-trigger"
				onClick={() => setIsOpen(true)}
				title="Aide IA pour rédiger la description"
			>
				<svg 
					viewBox="0 0 24 24" 
					fill="none" 
					stroke="currentColor" 
					strokeWidth="2"
					className="ai-icon"
				>
					<path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
					<circle cx="7.5" cy="14.5" r="1.5"/>
					<circle cx="16.5" cy="14.5" r="1.5"/>
				</svg>
				<span>Aide IA</span>
			</button>

			{isOpen && (
				<div className="ai-modal-overlay" onClick={() => setIsOpen(false)}>
					<div className="ai-modal" onClick={e => e.stopPropagation()}>
						<div className="ai-modal-header">
							<h3>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ai-icon-header">
									<path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
									<circle cx="7.5" cy="14.5" r="1.5"/>
									<circle cx="16.5" cy="14.5" r="1.5"/>
								</svg>
								Assistant IA pour votre description
							</h3>
							<button 
								type="button" 
								className="close-btn"
								onClick={() => setIsOpen(false)}
							>
								×
							</button>
						</div>

						<div className="ai-modal-body">
							<div className="ai-context">
								<p className="context-label">Contexte du projet :</p>
								<div className="context-info">
									<span className="context-item">
										<strong>Titre :</strong> {titre || <em>Non renseigné</em>}
									</span>
									{categorie && (
										<span className="context-item">
											<strong>Catégorie :</strong> {categorie}
										</span>
									)}
									{objectifFinancier && (
										<span className="context-item">
											<strong>Objectif :</strong> {objectifFinancier}€
										</span>
									)}
								</div>
							</div>

							<div className="prompt-type-selector">
								<label>Type d'aide :</label>
								<div className="prompt-options">
									<button
										type="button"
										className={`prompt-option ${promptType === 'complete' ? 'active' : ''}`}
										onClick={() => setPromptType('complete')}
									>
										<span className="option-icon">✨</span>
										<span className="option-text">
											<strong>Générer</strong>
											<small>Créer une description complète</small>
										</span>
									</button>
									<button
										type="button"
										className={`prompt-option ${promptType === 'improve' ? 'active' : ''}`}
										onClick={() => setPromptType('improve')}
										disabled={!currentDescription}
									>
										<span className="option-icon">🔄</span>
										<span className="option-text">
											<strong>Améliorer</strong>
											<small>Optimiser le texte existant</small>
										</span>
									</button>
									<button
										type="button"
										className={`prompt-option ${promptType === 'expand' ? 'active' : ''}`}
										onClick={() => setPromptType('expand')}
										disabled={!currentDescription}
									>
										<span className="option-icon">📝</span>
										<span className="option-text">
											<strong>Enrichir</strong>
											<small>Ajouter des détails</small>
										</span>
									</button>
								</div>
							</div>

							{currentDescription && (
								<div className="current-description">
									<p className="context-label">Description actuelle :</p>
									<div className="description-preview">
										{currentDescription.substring(0, 200)}
										{currentDescription.length > 200 && '...'}
									</div>
								</div>
							)}

							<button
								type="button"
								className="generate-btn"
								onClick={generateDescription}
								disabled={isLoading || !titre.trim()}
							>
								{isLoading ? (
									<>
										<span className="loader-spinner"></span>
										Génération en cours...
									</>
								) : (
									<>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
										</svg>
										Générer avec l'IA
									</>
								)}
							</button>

							{error && (
								<div className="ai-error">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<circle cx="12" cy="12" r="10"/>
										<line x1="12" y1="8" x2="12" y2="12"/>
										<line x1="12" y1="16" x2="12.01" y2="16"/>
									</svg>
									{error}
								</div>
							)}

							{suggestion && (
								<div className="ai-suggestion">
									<p className="suggestion-label">Suggestion de l'IA :</p>
									<div className="suggestion-content">
										{suggestion}
									</div>
									<div className="suggestion-actions">
										<button
											type="button"
											className="action-btn apply-btn"
											onClick={handleApply}
										>
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<polyline points="20 6 9 17 4 12"/>
											</svg>
											Remplacer la description
										</button>
										{currentDescription && (
											<button
												type="button"
												className="action-btn append-btn"
												onClick={handleAppend}
											>
												<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<line x1="12" y1="5" x2="12" y2="19"/>
													<line x1="5" y1="12" x2="19" y2="12"/>
												</svg>
												Ajouter à la suite
											</button>
										)}
										<button
											type="button"
											className="action-btn regenerate-btn"
											onClick={generateDescription}
											disabled={isLoading}
										>
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<polyline points="23 4 23 10 17 10"/>
												<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
											</svg>
											Régénérer
										</button>
									</div>
								</div>
							)}

							<div className="ai-tips">
								<h4>💡 Conseils pour une bonne description :</h4>
								<ul>
									<li>Expliquez clairement l'objectif de votre projet</li>
									<li>Décrivez pourquoi vous avez besoin de ce financement</li>
									<li>Partagez votre histoire et votre motivation</li>
									<li>Détaillez comment les fonds seront utilisés</li>
									<li>Ajoutez des éléments qui inspirent confiance</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

AIDescriptionHelper.propTypes = {
	titre: PropTypes.string,
	categorie: PropTypes.string,
	currentDescription: PropTypes.string,
	onApplyDescription: PropTypes.func.isRequired,
	objectifFinancier: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

AIDescriptionHelper.defaultProps = {
	titre: '',
	categorie: '',
	currentDescription: '',
	objectifFinancier: ''
};
