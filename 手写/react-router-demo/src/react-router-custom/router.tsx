import React, { type PropsWithChildren } from 'react';

const RouterContext = React.createContext({
  path: '',
  navigate: (url: string) => {},
});

const Router: React.FC<PropsWithChildren> = (props) => {
  const [path, setPath] = React.useState('');

  React.useState(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {props.children}
    </RouterContext.Provider>
  );
};

export default Router;

export { RouterContext };
