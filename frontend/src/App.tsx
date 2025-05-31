// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import EmpresasForm from './pages/EmpresasForm';
import EmpresasList from './pages/EmpresasList';
import PublicPage from './pages/PublicPage';

import { EmpresasProvider } from "./EmpresasContext";
import { ThemeProvider } from "./theme/ThemeContext";

/* Core CSS required for Ionic components to work properly */
// ESTOS DEBEN IR PRIMERO
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// ====================================================================
// ¡¡¡ AHORA SÍ, TU ARCHIVO DE VARIABLES PERSONALIZADAS !!!
// ====================================================================

/* Variables de tema personalizadas */
import './theme/variables.css'; // <-- ¡Esta línea debe ir DESPUÉS de TODOS los CSS de Ionic!

setupIonicReact();

const AppContent: React.FC = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>InfoCiudad</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonRouterOutlet basePath="/" ionPage={true} {...({} as any)}>
        <Switch>
          <Route path="/home" component={Home} exact={true} />
          <Route path="/empresas" component={EmpresasForm} exact={true} />
          <Route path="/empresasList" component={EmpresasList} exact={true} />
          <Route path="/publicpage" component={PublicPage} exact={true} />
          <Redirect from="/" to="/publicpage" exact={true} />
        </Switch>
      </IonRouterOutlet>
    </>
  );
};

const App: React.FC = () => (
  <IonApp>
    <ThemeProvider>
      <EmpresasProvider>
        <IonReactRouter>
          <AppContent />
        </IonReactRouter>
      </EmpresasProvider>
    </ThemeProvider>
  </IonApp>
);

export default App;