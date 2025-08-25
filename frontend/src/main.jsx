import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'
import ErrorBoundary from './ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Theme>
        <App />
      </Theme>
    </ErrorBoundary>
  </React.StrictMode>,
)
