import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global error handler to catch and log errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    stack: event.error?.stack
  });
  
  // Show user-friendly error message
  if (event.message.includes('Unexpected token')) {
    console.error('Syntax Error Details:', {
      possibleCause: 'JavaScript file being parsed as HTML or syntax error in component',
      filename: event.filename,
      line: event.lineno
    });
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
