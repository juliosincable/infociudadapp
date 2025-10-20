
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

// 🛑 CORRECCIÓN CLAVE: Se elimina <React.StrictMode>
// Esto detiene el doble renderizado en desarrollo que causaba
// la duplicación de íconos en el footer.
root.render(
    <App />
);