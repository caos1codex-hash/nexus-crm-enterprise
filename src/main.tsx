import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// @ts-expect-error CSS side-effect import
import './index.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter basename="/nexus-crm-enterprise">
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}