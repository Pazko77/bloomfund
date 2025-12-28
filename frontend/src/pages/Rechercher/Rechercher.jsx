import React, { useState, useEffect, useRef } from "react";
import "./Rechercher.scss";
import CagnotteCard from "../../components/CagnotteCard/CagnotteCard.jsx";

const Rechercher = ({ onSelect }) => {
  // États pour la recherche principale
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // États pour la recherche de localisation
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationSelectedIndex, setLocationSelectedIndex] = useState(-1);

  // États pour les filtres
  const [selectedCategory, setSelectedCategory] = useState("Catégories");
  const [selectedLocation, setSelectedLocation] = useState("Villes/Dep");
  const [selectedSort, setSelectedSort] = useState("Date");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const searchRef = useRef(null);
  const timeoutRef = useRef(null);
  const locationTimeoutRef = useRef(null);
  const categoryRef = useRef(null);
  const locationRef = useRef(null);
  const sortRef = useRef(null);

  const categories = [
    "Toutes catégories",
    "Emploi",
    "Immobilier",
    "Véhicules",
    "Services",
  ];
  const sortOptions = ["Date", "Pertinence"];

  //api cagnottes mock
  // const [cagnottes, setCagnottes] = useState([]);
  // const [chargement, setChargement] = useState(true);

  // useEffect(() => {
  // 	// Remplacez cette URL par celle que le backend vous donnera
  // 	const API_URL = "#";
  //
  // 	fetch(API_URL)
  // 		.then(response => response.json()) // On transforme la réponse en JSON
  // 		.then(data => {
  // 			setCagnottes(data);   // On met les données dans notre state
  // 			setChargement(false); // On arrête l'affichage "chargement"
  // 		})
  // 		.catch(error => {
  // 			console.error("Erreur de récupération :", error);
  // 			setChargement(false);
  // 		});
  // }, []);

  const cagnottes = [
    {
      id: 1,
      auteur: "moi",
      date: "20510",
      description: "SSKJDS",
      image: "https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg",
      titre: "Yo",
    },
    {
      id: 2,
      auteur: "Léa",
      date: "2024",
      description: "Une autre description",
      image: "https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg",
      titre: "Aventure",
    },
    // Ajoutez autant d'objets que vous voulez ici...
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(locationQuery)}&fields=nom,code,codeDepartement,departement&boost=population&limit=5`,
          ).then((r) => r.json()),
          fetch(
            `https://geo.api.gouv.fr/departements?nom=${encodeURIComponent(locationQuery)}`,
          ).then((r) => r.json()),
        ]);

        const formattedSuggestions = [
          ...communes.map((c) => ({
            type: "ville",
            code: c.code,
            nom: c.nom,
            departement: c.departement.nom,
            codeDepartement: c.codeDepartement,
            displayValue:
              c.nom === c.departement.nom
                ? `${c.nom} (${c.codeDepartement})`
                : `${c.nom}, ${c.departement.nom} (${c.codeDepartement})`,
            subText:
              c.nom === c.departement.nom
                ? `Code commune: ${c.code}`
                : `${c.departement.nom} (${c.codeDepartement})`,
          })),
          ...departements.map((d) => ({
            type: "departement",
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
        console.error("Erreur lors de la récupération des suggestions:", error);
        setLocationSuggestions([]);
      } finally {
        setIsLocationLoading(false);
      }
    }, 400);
  }, [locationQuery]);

  const handleSelect = (suggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleLocationSelect = (suggestion) => {
    setSelectedLocation(suggestion.displayValue);
    setLocationQuery("");
    setShowLocationDropdown(false);
    setIsLocationOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleLocationKeyDown = (e) => {
    if (!isLocationOpen || locationSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setLocationSelectedIndex((prev) =>
          prev < locationSuggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setLocationSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (locationSelectedIndex >= 0) {
          handleLocationSelect(locationSuggestions[locationSelectedIndex]);
        }
        break;
      case "Escape":
        setIsLocationOpen(false);
        setLocationSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="rechercher">
      {/* 1. Barre de recherche principale */}
      <div className="rechercher_searchbar">
        <div className="rechercher_container" ref={searchRef}>
          <div className="rechercher_inputwrapper">
            <svg
              className="rechercher_searchicon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="rechercher_input"
              placeholder="Rechercher"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            />
            {isLoading && (
              <div className="rechercher_spinner">
                <div className="spinner"></div>
              </div>
            )}
          </div>

          {isOpen && suggestions.length > 0 && (
            <div className="rechercher_dropdown show">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`rechercher_item ${
                    index === selectedIndex ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="rechercher_itemmain">{suggestion.text}</div>
                </div>
              ))}
            </div>
          )}

          {isOpen &&
            !isLoading &&
            suggestions.length === 0 &&
            query.length >= 2 && (
              <div className="rechercher_dropdown show">
                <div className="rechercher_item noresults">
                  Aucun résultat trouvé
                </div>
              </div>
            )}
        </div>
      </div>
      {/* 2. Filtres */}
      <div className="rechercher_filters">
        {/* Filtre Catégories */}
        <div className="rechercher_filtergroup">
          <label className="rechercher_filterlabel">Filtre :</label>
          <div className="rechercher_filterdropdown" ref={categoryRef}>
            <button
              className="rechercher_filterbutton"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {selectedCategory}
              <svg
                className="rechercher_filterarrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showCategoryDropdown && (
              <div className="rechercher_filtermenu">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="rechercher_filteroption"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filtre Lieu avec recherche séparée */}
        <div className="rechercher_filtergroup">
          <label className="rechercher_filterlabel">Lieu :</label>
          <div className="rechercher_filterdropdown" ref={locationRef}>
            <button
              className="rechercher_filterbutton"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            >
              {selectedLocation}
              <svg
                className="rechercher_filterarrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showLocationDropdown && (
              <div className="rechercher_filtermenu location">
                <div className="rechercher_filtersearch">
                  <input
                    type="text"
                    placeholder="Rechercher une ville ou département..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={handleLocationKeyDown}
                    onFocus={() =>
                      locationSuggestions.length > 0 && setIsLocationOpen(true)
                    }
                  />
                  {isLocationLoading && (
                    <div className="rechercher_locationspinner">
                      <div className="spinner"></div>
                    </div>
                  )}
                </div>

                {isLocationOpen && locationSuggestions.length > 0 && (
                  <div className="rechercher_locationresults">
                    {locationSuggestions.map((suggestion, index) => (
                      <div
                        key={`${suggestion.type}-${suggestion.code}`}
                        className={`rechercher_filteroption ${
                          index === locationSelectedIndex ? "selected" : ""
                        }`}
                        onClick={() => handleLocationSelect(suggestion)}
                        onMouseEnter={() => setLocationSelectedIndex(index)}
                      >
                        <div className="rechercher_filteroptionmain">
                          {suggestion.nom}
                          <span
                            className={`rechercher_filterbadge ${suggestion.type}`}
                          >
                            {suggestion.type === "ville" ? "Ville" : "Dép."}
                          </span>
                        </div>
                        <div className="rechercher_filteroptionsub">
                          {suggestion.subText}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isLocationOpen &&
                  !isLocationLoading &&
                  locationSuggestions.length === 0 &&
                  locationQuery.length >= 2 && (
                    <div className="rechercher_locationresults">
                      <div className="rechercher_filteroption empty">
                        Aucun résultat trouvé
                      </div>
                    </div>
                  )}

                {!isLocationOpen && locationQuery.length < 2 && (
                  <div className="rechercher_filteroption empty">
                    Tapez au moins 2 caractères...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filtre Tri */}
        <div className="rechercher_filtergroup">
          <label className="rechercher_filterlabel">Tri :</label>
          <div className="rechercher_filterdropdown" ref={sortRef}>
            <button
              className="rechercher_filterbutton"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              {selectedSort}
              <svg
                className="rechercher_filterarrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showSortDropdown && (
              <div className="rechercher_filtermenu">
                {sortOptions.map((option) => (
                  <div
                    key={option}
                    className="rechercher_filteroption"
                    onClick={() => {
                      setSelectedSort(option);
                      setShowSortDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 3. Affichage des cagnottes */}
      <div className="rechercher_cardwrapper">
        {/* 4. Si le tableau est vide, on affiche un message, sinon on boucle */}
        {cagnottes.length === 0 ? (
          <p>Aucune cagnotte trouvée.</p>
        ) : (
          cagnottes.map((item) => (
            <CagnotteCard
              id={item.id}
              auteur={item.auteur}
              date={item.date}
              description={item.description}
              image={item.image}
              titre={item.titre}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Rechercher;
