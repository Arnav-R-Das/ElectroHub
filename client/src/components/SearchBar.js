import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/products/search/suggestions', {
          params: { q: query }
        });
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
    setQuery('');
    setShowSuggestions(false);
  };

  const handleQuickSearch = (quickQuery) => {
    navigate(`/search?q=${encodeURIComponent(quickQuery)}`);
    setShowSuggestions(false);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands, or categories..."
            className="search-input"
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          />
          <button type="submit" className="search-button">
            🔍
          </button>
          
          {loading && (
            <div className="search-loading">
              <div className="spinner"></div>
            </div>
          )}
        </div>

        {/* Quick Search Tags */}
        <div className="quick-search-tags">
          <span className="quick-search-label">Popular:</span>
          <button type="button" onClick={() => handleQuickSearch('iPhone')} className="quick-tag">
            iPhone
          </button>
          <button type="button" onClick={() => handleQuickSearch('Samsung')} className="quick-tag">
            Samsung
          </button>
          <button type="button" onClick={() => handleQuickSearch('Laptop')} className="quick-tag">
            Laptop
          </button>
          <button type="button" onClick={() => handleQuickSearch('Headphones')} className="quick-tag">
            Headphones
          </button>
          <button type="button" onClick={() => handleQuickSearch('Gaming')} className="quick-tag">
            Gaming
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <img
                src={suggestion.image || 'https://via.placeholder.com/40'}
                alt={suggestion.name}
                className="suggestion-image"
              />
              <div className="suggestion-info">
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-details">
                  <span className="suggestion-brand">{suggestion.brand}</span>
                  <span className="suggestion-category">{suggestion.category}</span>
                  <span className="suggestion-price">
                    ₹{suggestion.discount > 0 
                      ? Math.round(suggestion.price * (100 - suggestion.discount) / 100).toLocaleString('en-IN')
                      : suggestion.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="suggestions-dropdown">
          <div className="no-suggestions">No products found for "{query}"</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;