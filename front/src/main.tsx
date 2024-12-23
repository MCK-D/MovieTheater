import ReactDOM from 'react-dom/client';
import App from './App';
import {AuthProvider} from "./context/AuthContext.tsx";
import React from 'react';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}