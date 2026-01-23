import React from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <ProductList />
      </main>
    </div>
  );
}

export default App;