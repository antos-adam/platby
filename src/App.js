import 'bulma/css/bulma.min.css';
import Login from './Components/Login'
import User from "./Components/User"
import Admin from "./Components/Admin"
import React, { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <body>
      <div className="section">
        <div className="container">
          <main>
            <BrowserRouter>
              <Routes>
                <Route index path="/" element={<Login />} />
                <Route path="/user" element={<User />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </BrowserRouter>
          </main>
        </div>
      </div>
    </body>
  )
}

export default App;