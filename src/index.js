import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bulma/css/bulma.min.css';

import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';


const root = ReactDOM.createRoot(document.getElementById('root'));

const TOKEN_STORAGE_KEY = "token-storage-key"
const client = new ApolloClient(
	{
	uri: 'https://api.platby.tk/graphql',
	cache: new InMemoryCache(),
	headers: {
		authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`
	},
  	credentials: 'include',
});


root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
