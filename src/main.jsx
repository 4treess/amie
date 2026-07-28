import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // Ensure this exists for your Tailwind or custom CSS
import RelationshipTimeline from './RelationshipTimeline.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Mines from './Mines.jsx';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)



export default App;