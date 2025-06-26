import React, { useState, useEffect } from 'react';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://xcountries-backend.azurewebsites.net/all');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data); // Initialize filtered countries with all countries
      } catch (err) {
        console.error('Error fetching data: ', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries based on search term
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

  // Styles
  const styles = {
    app: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center'
    },
    search: {
      margin: '20px 0',
      padding: '10px',
      width: '300px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
      backgroundColor: '#fff'
    },
    flag: {
      width: '100px',
      height: 'auto',
      marginBottom: '10px',
      border: '1px solid #eee'
    },
    name: {
      margin: '0',
      fontSize: '14px',
      fontWeight: '600'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '1.2rem'
    },
    error: {
      color: 'red',
      textAlign: 'center',
      padding: '40px',
      fontSize: '1.2rem'
    },
    noResults: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '1.2rem',
      gridColumn: '1 / -1'
    }
  };

  if (loading) return <div style={styles.loading}>Loading countries...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.app}>
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.search}
      />
      
      <div style={styles.grid}>
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div 
              key={country.alpha2Code}
              style={styles.card}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={country.flag}
                alt={`Flag of ${country.name}`}
                style={styles.flag}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x75?text=Flag+Missing';
                }}
              />
              <p style={styles.name}>{country.name}</p>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>No countries found matching your search</div>
        )}
      </div>
    </div>
  );
};

export default Countries;