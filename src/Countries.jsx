import React, { useState, useEffect } from 'react';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchCountries = async () => {
    try {
      const response = await fetch('https://xcountries-backend.azurewebsites.net/all');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      setCountries(data);
    } catch (err) {
      console.error('Error fetching data: ', err);  // Changed this line
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCountries();
}, []);

  // Styles
  const styles = {
    app: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center'
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
    }
  };

  if (loading) return <div style={styles.loading}>Loading countries...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.app}>
      <div style={styles.grid}>
        {countries.map((country) => (
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
        ))}
      </div>
    </div>
  );
};

export default Countries;