import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RangePainterContextProvider } from './contexts/RangePainterContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RangePainterContextProvider>
      <App />
    </RangePainterContextProvider>
  </StrictMode>,
)
