import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeDummyData, updateAdminDaysRemaining } from './utils/initialData';
import { setupSessionTimeout } from './utils/auth';

// Initialize dummy data
initializeDummyData();
updateAdminDaysRemaining();

// Setup session timeout check
setupSessionTimeout(() => {
  // This will be called when session times out
  console.log('Session timed out');
  window.location.href = '/login'; // Redirect to login
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);