import React from 'react';
import { RouterContext } from './router';

type Props = {
  path: string;
  exact: boolean;
  component: React.ReactElement;
};

const Route: React.FC<Props> = (props) => {
  const { path: routePath, component: Component, exact } = props;
  const { path } = React.useContext(RouterContext);

  // 简单路径匹配逻辑
  const matchRoute = () => {
    if (exact) {
      return path === routePath;
    }

    return path.startsWith(routePath);
  };

  return matchRoute() ? Component : null;
};

export default Route;
