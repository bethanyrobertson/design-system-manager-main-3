import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'
import "@radix-ui/themes/styles.css";

console.log('🚀 main.jsx: Starting React app...');
console.log('🚀 main.jsx: Root element found:', document.getElementById('root'));

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
  console.log('✅ main.jsx: React root created and rendered');
} catch (error) {
  console.error('❌ main.jsx: Error creating React root:', error);
}
