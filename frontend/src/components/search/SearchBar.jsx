import React from 'react';

const SearchBar = ({
    query,
    setQuery,
    suggestions,
    isOpen,
    setIsOpen,
    isLoading,
    selectedIndex,
    setSelectedIndex,
    handleSelect,
    handleKeyDown,
    searchRef,
}) => {
    return (
        <div className="rechercher_searchbar">
            <div className="rechercher_container" ref={searchRef}>
                <div className="rechercher_inputwrapper">
                    <svg className="rechercher_searchicon" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
                        onChange={e => setQuery(e.target.value)}
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
                                className={`rechercher_item ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => handleSelect(suggestion)}
                                onMouseEnter={() => setSelectedIndex(index)}>
                                <div className="rechercher_itemmain">{suggestion.text}</div>
                            </div>
                        ))}
                    </div>
                )}

                {isOpen && !isLoading && suggestions.length === 0 && query.length >= 2 && (
                    <div className="rechercher_dropdown show">
                        <div className="rechercher_item noresults">Aucun résultat trouvé</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;