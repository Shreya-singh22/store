import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <StoreProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </StoreProvider>
    </AdminProvider>
  </StrictMode>,
);