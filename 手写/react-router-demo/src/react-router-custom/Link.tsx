import React from 'react';
import { RouterContext } from './router';

function Link({ to, children }) {
  const { navigate } = React.useContext(RouterContext);

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      style={{ color: '#007bff', textDecoration: 'none' }}
    >
      {children}
    </a>
  );
}

export default Link;
