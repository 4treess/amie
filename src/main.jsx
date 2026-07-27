import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Ensure this exists for your Tailwind or custom CSS
import RelationshipTimeline from './App.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Mines from './Mines';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RelationshipTimeline />
  </React.StrictMode>,
)



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RelationshipTimeline />} />
        <Route path="/mines" element={<Mines />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;