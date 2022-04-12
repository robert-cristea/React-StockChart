import React from 'react';
import Stock from './Stock';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import AppNavbar from './Navbar';

function App() {
  return (
    <div className="App">
      <AppNavbar />
      <div style={{marginTop:50}}>
        <Routes>
          <Route path='/' element={<Home />} /> 
          <Route path='/stock' element={<Stock />} /> 
        </Routes>
      </div>
    </div>
  );
}

export default App;
