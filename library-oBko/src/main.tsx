import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext';
import WishlistProvider from '@/context/WishlistContext'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
     <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
