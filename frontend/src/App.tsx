import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import EmpresasForm from './pages/EmpresasForm'; // Importa la nueva página
import EmpresasList from './pages/EmpresasList'; // Importa la nueva página
import { EmpresasProvider } from "./EmpresasContext"; // Importa el proveedor del contexto

/* Core CSS required for Ionic components to work properly */
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
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <EmpresasProvider>
    <IonReactRouter>
      <IonRouterOutlet basePath="/" ionPage={true} {...({} as any)}>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/empresas" component={EmpresasForm} /> {/* Nueva ruta para Empresas */}
          <Route path="/empresaslist" component={EmpresasList} /> {/* Nueva ruta para Empresas */}
          <Redirect from="/" to="/home" />
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
    </EmpresasProvider>
  </IonApp>
);

export default App;


