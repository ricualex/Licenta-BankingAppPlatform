import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2024 Easy Vault. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    position: 'fixed',
    bottom: '0',
    width: '100%',
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
    padding: '10px 0',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.1)'
  },
  text: {
    margin: '0',
    color: 'white',
    fontSize: '0.9em',
  }
};

export default Footer;
