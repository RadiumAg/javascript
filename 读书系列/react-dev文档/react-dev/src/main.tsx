import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Root, {
  loader as rootLoader,
  action as rootAction,
} from './routes/root';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Contact, { loader as contactLoader } from './routes/contact.tsx';
import EditContact, { action as editAction } from './routes/edit';
import { action as destroyAction } from './routes/destroy';
import Index from './routes/index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    action: rootAction,
    loader: rootLoader,
    children: [
      {
        loader: contactLoader,
        path: 'contacts/:contactId',
        element: <Contact />,
      },
      {
        action: editAction,
        loader: contactLoader,
        path: 'contacts/:contactId/edit',
        element: <EditContact />,
      },
      {
        path: 'contacts/:contactId/destroy',
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>,
      },
      {
        index: true,
        element: <Index />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
