import React from 'react';

const WelcomeMessage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Easy Vault</h1>
      <p style={styles.subheading}>Your trusted partner in secure and convenient banking.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    borderBottom: '2px solid white',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  heading: {
    fontSize: '2.5em',
    color: 'white',
    margin: '0 0 10px'
  },
  subheading: {
    fontSize: '1.2em',
    color: 'white'
  }
};

export default WelcomeMessage;
