import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Clear old v2 cached data that may contain mock/default data
// This ensures users see only real backend-provided data
const OLD_KEYS = [
  'nexus_db_missions_v2',
  'nexus_db_documents_v2',
  'nexus_db_nodes_v2'
];
OLD_KEYS.forEach(key => {
  try { localStorage.removeItem(key); } catch {}
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
