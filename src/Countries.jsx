import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure you have this CSS file

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countries-search-data-prod-812920491762.asia-south1.run.app/countries');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (err) {
        console.error('Error fetching countries data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  if (loading) return <div className="loading">Loading countries...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <h1>Country Flags</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="countries-grid">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div 
              key={country.alpha2Code}
              className="countryCard" // This is REQUIRED for the tests
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={country.flag}
                alt={`Flag of ${country.name}`}
                className="flag-img"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x75?text=Flag+Missing';
                }}
              />
              <p className="country-name">{country.name}</p>
            </div>
          ))
        ) : (
          <div className="no-results">No countries found matching your search</div>
        )}
      </div>
    </div>
  );
};

export default Countries;