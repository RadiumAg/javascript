import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useContext,
} from 'react';
import { matchPath, useLocation, useOutlet } from 'react-router-dom';

interface KeepAliveLayoutProps extends PropsWithChildren {
  keepPaths: Array<string | RegExp>;
  keepElements?: Record<string, ReactNode>;
  dropByPath?: (path: string) => void;
}

type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, 'children'>;

const keepElements: KeepAliveLayoutProps['keepElements'] = {};

export const KeepAliveContext = createContext<KeepAliveContextType>({
  keepPaths: [],
  keepElements,
  dropByPath(path) {
    keepElements[path] = null;
  },
});

const isKeepPath = (keepPaths: Array<string | RegExp>, path: string) => {
  let isKeep = false;
  for (let i = 0; i < keepPaths.length; i++) {
    const item = keepPaths[i];
    if (item === path) {
      isKeep = true;
    }

    if (item instanceof RegExp && item.test(path)) {
      isKeep = true;
    }

    if (typeof item === 'string' && item.toLocaleLowerCase() === path) {
      isKeep = true;
    }
  }

  return isKeep;
};

export function useKeepOutlet() {
  const location = useLocation();
  const element = useOutlet();

  const { keepElements, keepPaths } = useContext(KeepAliveContext);
  const isKeep = isKeepPath(keepPaths, location.pathname);

  if (isKeep) {
    keepElements[location.pathname] = element;
  }

  return (
    <>
      {Object.entries(keepElements).map(([pathName, element]) => {
        return (
          <div
            key={pathName}
            style={{
              height: '100%',
              width: '100%',
              position: 'relative',
              overflow: 'hidden auto',
            }}
            className="keep-alive-page"
            hidden={!matchPath(location.pathname, pathName)}
          >
            {element}
          </div>
        );
      })}

      {!isKeep && element}
    </>
  );
}

const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
  const { keepPaths, ...other } = props;

  const { keepElements, dropByPath } = useContext(KeepAliveContext);

  return (
    <KeepAliveContext.Provider
      value={{ keepPaths, keepElements, dropByPath }}
      {...other}
    ></KeepAliveContext.Provider>
  );
};

export default KeepAliveLayout;
