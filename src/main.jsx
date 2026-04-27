import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Ensure this exists for your Tailwind or custom CSS
import RelationshipTimeline from './Timeline.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RelationshipTimeline />
  </React.StrictMode>,
)