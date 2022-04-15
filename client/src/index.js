import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";
import { render } from "react-dom";
import App from './components/App';
import { CurrentTangentProvider } from './components/Tangent/CurrentTangentContext';
import { CurrentUserProvider } from './components/Profile/CurrentUserContext';

const { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID } = process.env;
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Auth0Provider
    domain={REACT_APP_AUTH0_DOMAIN}
    clientId={REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
  >
  <CurrentUserProvider>
    <CurrentTangentProvider>
      <App />
    </CurrentTangentProvider>
  </CurrentUserProvider>
  </Auth0Provider>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

