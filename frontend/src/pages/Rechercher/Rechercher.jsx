import React, { useState, useEffect, useRef } from "react";
// import axios from 'axios';
import './Rechercher.scss';
import api from '../../helpers/request/api.js';
import SearchBar from '../../components/search/SearchBar';
import Filters from '../../components/search/Filters';
import ResultsGrid from '../../components/search/ResultsGrid';

const Rechercher = ({ onSelect }) => {
	// États pour la recherche principale
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);

	// États pour la recherche de localisation
	const [locationQuery, setLocationQuery] = useState('');
	const [locationSuggestions, setLocationSuggestions] = useState([]);
	const [isLocationOpen, setIsLocationOpen] = useState(false);
	const [isLocationLoading, setIsLocationLoading] = useState(false);
	const [locationSelectedIndex, setLocationSelectedIndex] = useState(-1);

	// États pour les filtres
	const [selectedCategory, setSelectedCategory] = useState('Catégories');
	const [selectedLocation, setSelectedLocation] = useState('Villes/Dep');
	const [selectedSort, setSelectedSort] = useState('Date');
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [showSortDropdown, setShowSortDropdown] = useState(false);

	const searchRef = useRef(null);
	const timeoutRef = useRef(null);
	const locationTimeoutRef = useRef(null);
	const categoryRef = useRef(null);
	const locationRef = useRef(null);
	const sortRef = useRef(null);

	const sortOptions = ['Date', 'Pertinence'];

	const [Categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.get(`/categories`);
				// console.log('Catégories récupérées :', response.data);
				setCategories(response.data);
			} catch (error) {
				console.error('Erreur lors de la récupération des catégories :', error);
			}
		};

		fetchCategories();
	}, []);

	const categories = ['Toutes catégories', ...Categories.map(cat => cat.nom)];

	// api cagnottes mock
	const [cagnottes, setCagnottes] = useState([]);

	useEffect(() => {
		const fetchCagnottes = async () => {
			try {
				const response = await api.get(`/projets`);
				const adaptedCagnottes = response.data.map(item => {
					const dateObj = new Date(item.date_creation);
					const formattedDate = dateObj.toLocaleDateString('fr-FR', {
						day: '2-digit',
						month: 'long',
						year: 'numeric',
					});

					return {
						id: item.projet_id,
						auteur: `${item.porteur_nom} ${item.porteur_prenom.charAt(0)}.`,
						date: formattedDate,
						dateRaw: new Date(item.date_creation),
						description: item.description,
						image: item.image_url,
						titre: item.titre,
						categorie: item.categorie_nom,
						localisation: item.localisation,
					};
				});
				setCagnottes(adaptedCagnottes);
			} catch (error) {
				console.error('Erreur lors de la récupération des projets :', error);
			}
		};

		fetchCagnottes();
	}, []);

	// Filtrage et tri des cagnottes
	const filteredCagnottes = cagnottes
		.filter(cagnotte => {
			// Filtre par catégorie
			if (selectedCategory !== 'Catégories' && selectedCategory !== 'Toutes catégories') {
				if (cagnotte.categorie !== selectedCategory) return false;
			}
			// Filtre par localisation (département)
			if (selectedLocation !== 'Villes/Dep') {
				// Extraire le code département du filtre sélectionné (ex: "Paris (75)" -> "75")
				const codeMatch = selectedLocation.match(/\((\d+[A-B]?)\)/);
				if (codeMatch) {
					const codeDep = codeMatch[1];
					// Vérifier si la localisation de la cagnotte contient ce département
					if (!cagnotte.localisation || !cagnotte.localisation.includes(`(${codeDep})`)) {
						return false;
					}
				}
			}
			// Filtre par recherche texte
			if (query.length >= 2) {
				const searchLower = query.toLowerCase();
				if (
					!cagnotte.titre.toLowerCase().includes(searchLower) &&
					!cagnotte.description.toLowerCase().includes(searchLower) &&
					!cagnotte.auteur.toLowerCase().includes(searchLower)
				) {
					return false;
				}
			}
			return true;
		})
		.sort((a, b) => {
			// Tri par date (plus récent en premier)
			if (selectedSort === 'Date') {
				return b.dateRaw - a.dateRaw;
			}
			// Tri par pertinence (basé sur la correspondance avec la recherche)
			if (selectedSort === 'Pertinence' && query.length >= 2) {
				const searchLower = query.toLowerCase();
				const scoreA = (a.titre.toLowerCase().includes(searchLower) ? 2 : 0) + (a.description.toLowerCase().includes(searchLower) ? 1 : 0);
				const scoreB = (b.titre.toLowerCase().includes(searchLower) ? 2 : 0) + (b.description.toLowerCase().includes(searchLower) ? 1 : 0);
				return scoreB - scoreA;
			}
			return 0;
		});

	useEffect(() => {
		const handleClickOutside = e => {
			if (searchRef.current && !searchRef.current.contains(e.target)) {
				setIsOpen(false);
			}
			if (categoryRef.current && !categoryRef.current.contains(e.target)) {
				setShowCategoryDropdown(false);
			}
			if (locationRef.current && !locationRef.current.contains(e.target)) {
				setShowLocationDropdown(false);
			}
			if (sortRef.current && !sortRef.current.contains(e.target)) {
				setShowSortDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Recherche principale (pour les annonces, produits, etc.)
	useEffect(() => {
		if (query.length < 2) {
			setSuggestions([]);
			setIsOpen(false);
			return;
		}

		setIsLoading(true);
		clearTimeout(timeoutRef.current);

		timeoutRef.current = setTimeout(() => {
			// Simuler des suggestions de recherche
			const mockSuggestions = [{ id: 1, text: `${query} - Résultats récents` }];

			setSuggestions(mockSuggestions);
			setIsOpen(mockSuggestions.length > 0);
			setSelectedIndex(-1);
			setIsLoading(false);
		}, 300);
	}, [query]);

	// Recherche de localisation (départements et villes)
	useEffect(() => {
		if (locationQuery.length < 2) {
			setLocationSuggestions([]);
			setIsLocationOpen(false);
			return;
		}

		setIsLocationLoading(true);
		clearTimeout(locationTimeoutRef.current);

		locationTimeoutRef.current = setTimeout(async () => {
			try {
				const [communes, departements] = await Promise.all([
					fetch(
						`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(locationQuery)}&fields=nom,code,codeDepartement,departement&boost=population&limit=5`
					).then(r => r.json()),
					fetch(`https://geo.api.gouv.fr/departements?nom=${encodeURIComponent(locationQuery)}`).then(r => r.json()),
				]);

				const formattedSuggestions = [
					...communes.map(c => ({
						type: 'ville',
						code: c.code,
						nom: c.nom,
						departement: c.departement.nom,
						codeDepartement: c.codeDepartement,
						displayValue: c.nom === c.departement.nom ? `${c.nom} (${c.codeDepartement})` : `${c.nom}, ${c.departement.nom} (${c.codeDepartement})`,
						subText: c.nom === c.departement.nom ? `Code commune: ${c.code}` : `${c.departement.nom} (${c.codeDepartement})`,
					})),
					...departements.map(d => ({
						type: 'departement',
						code: d.code,
						nom: d.nom,
						displayValue: `${d.nom} (${d.code})`,
						subText: `Code: ${d.code}`,
					})),
				];

				setLocationSuggestions(formattedSuggestions);
				setIsLocationOpen(formattedSuggestions.length > 0);
				setLocationSelectedIndex(-1);
			} catch (error) {
				console.error('Erreur lors de la récupération des suggestions:', error);
				setLocationSuggestions([]);
			} finally {
				setIsLocationLoading(false);
			}
		}, 400);
	}, [locationQuery]);

	const handleSelect = suggestion => {
		setQuery(suggestion.text);
		setIsOpen(false);
		setSelectedIndex(-1);
		if (onSelect) {
			onSelect(suggestion);
		}
	};

	const handleLocationSelect = suggestion => {
		setSelectedLocation(suggestion.displayValue);
		setLocationQuery('');
		setShowLocationDropdown(false);
		setIsLocationOpen(false);
	};

	const handleKeyDown = e => {
		if (!isOpen || suggestions.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0) {
					handleSelect(suggestions[selectedIndex]);
				}
				break;
			case 'Escape':
				setIsOpen(false);
				setSelectedIndex(-1);
				break;
			default:
				break;
		}
	};

	const handleLocationKeyDown = e => {
		if (!isLocationOpen || locationSuggestions.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setLocationSelectedIndex(prev => (prev < locationSuggestions.length - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setLocationSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Enter':
				e.preventDefault();
				if (locationSelectedIndex >= 0) {
					handleLocationSelect(locationSuggestions[locationSelectedIndex]);
				}
				break;
			case 'Escape':
				setIsLocationOpen(false);
				setLocationSelectedIndex(-1);
				break;
			default:
				break;
		}
	};

	return (
		<div className="rechercher">
			<SearchBar
				query={query}
				setQuery={setQuery}
				suggestions={suggestions}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				isLoading={isLoading}
				selectedIndex={selectedIndex}
				setSelectedIndex={setSelectedIndex}
				handleSelect={handleSelect}
				handleKeyDown={handleKeyDown}
				searchRef={searchRef}
			/>

			<Filters
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
				selectedLocation={selectedLocation}
				setSelectedLocation={setSelectedLocation}
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
				showCategoryDropdown={showCategoryDropdown}
				setShowCategoryDropdown={setShowCategoryDropdown}
				showLocationDropdown={showLocationDropdown}
				setShowLocationDropdown={setShowLocationDropdown}
				showSortDropdown={showSortDropdown}
				setShowSortDropdown={setShowSortDropdown}
				categories={categories}
				locationQuery={locationQuery}
				setLocationQuery={setLocationQuery}
				locationSuggestions={locationSuggestions}
				isLocationOpen={isLocationOpen}
				setIsLocationOpen={setIsLocationOpen}
				isLocationLoading={isLocationLoading}
				locationSelectedIndex={locationSelectedIndex}
				setLocationSelectedIndex={setLocationSelectedIndex}
				handleLocationSelect={handleLocationSelect}
				handleLocationKeyDown={handleLocationKeyDown}
				categoryRef={categoryRef}
				locationRef={locationRef}
				sortRef={sortRef}
				sortOptions={sortOptions}
			/>

			<ResultsGrid filteredCagnottes={filteredCagnottes} />
		</div>
	);
};;

export default Rechercher;
