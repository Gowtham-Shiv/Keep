import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';

// const routes = (
 
// );

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Home />} />
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  )

};
export default App
