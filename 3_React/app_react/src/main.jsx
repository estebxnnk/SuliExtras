import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SalarioMinimoProvider } from './providers/SalarioMinimoProvider'
import React from 'react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SalarioMinimoProvider>
      <App />
    </SalarioMinimoProvider>
  </StrictMode>,
)
