import Login from './Components/Login'
import User from "./Components/User"
import Admin from "./Components/Admin"
import React from "react"
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useAuthContext } from './Providers/AuthProvider';

const App = () => {
  const [{ jwt }] = useAuthContext();

  const client = new ApolloClient(
    {
    uri: 'https://api.platby.tk/graphql',
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${jwt}`
    },
      credentials: 'include',
  });

  return (
    <ApolloProvider client={client}>
      <div className="section">
        <div className="container">
          <main>
            <BrowserRouter>
              <Routes>
                <Route index path="/*" element={<Login />} />
                <Route path="/user" element={<User />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </BrowserRouter>
          </main>
        </div>
      </div>
    </ApolloProvider>
  )
}

export default App;