import React from 'react';
// Importamos los componentes de UI de '@ionic/react' necesarios para App.tsx
import {
    IonApp,
    IonRouterOutlet,
    setupIonicReact,
    IonMenu,
    IonMenuToggle,
    IonSplitPane,
    IonHeader,
    IonToolbar,
    IonTitle,
    // IonButtons, // Eliminado: No se usa directamente en App.tsx
    // IonButton,  // Eliminado: No se usa directamente en App.tsx
    // IonIcon,    // Eliminado: No se usa directamente en App.tsx
    IonContent,
    IonList,
    IonItem,
    IonLabel
} from '@ionic/react';

// Importamos solo IonReactRouter de '@ionic/react-router'
import { IonReactRouter } from '@ionic/react-router';
// Importamos Route, Switch, Redirect, useHistory desde 'react-router-dom'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

// import { menu as menuIcon } from 'ionicons/icons'; // Eliminado: No se usa directamente en App.tsx

import Home from './pages/Home';
import EmpresasForm from './pages/EmpresasForm';
import EmpresasList from './pages/EmpresasList';
import PublicPage from './pages/PublicPage';

import { EmpresasProvider } from "./EmpresasContext";
import { ThemeProvider } from "./theme/ThemeContext";

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

/* Variables de tema personalizadas */
import './theme/variables.css';

setupIonicReact();

const AppContent: React.FC = () => {
    const history = useHistory();

    return (
        <IonSplitPane contentId="main-content" when="false">
            {/* Menú Lateral */}
            <IonMenu contentId="main-content" type="overlay">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Menú InfoCiudad</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonMenuToggle autoHide={false}>
                            <IonItem button onClick={() => history.push('/publicpage')} lines="none">
                                <IonLabel>Inicio Público</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => history.push('/home')} lines="none">
                                <IonLabel>Home Admin</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => history.push('/empresas')} lines="none">
                                <IonLabel>Form Empresas</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => history.push('/empresasList')} lines="none">
                                <IonLabel>Lista Empresas</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
            </IonMenu>

            {/* Contenido principal con el Router Outlet */}
            <div className="ion-page" id="main-content">
                {/* Las páginas individuales (Home, EmpresasForm, etc.) definen su propio IonHeader y IonToolbar */}
                <IonRouterOutlet id="main-content">
                    <Switch>
                        <Route path="/home" component={Home} exact={true} />
                        <Route path="/empresas" component={EmpresasForm} exact={true} />
                        <Route path="/empresas/:id" component={EmpresasForm} />
                        <Route path="/empresasList" component={EmpresasList} exact={true} />
                        <Route path="/publicpage" component={PublicPage} exact={true} />
                        <Redirect from="/" to="/publicpage" exact={true} />
                    </Switch>
                </IonRouterOutlet>
            </div>
        </IonSplitPane>
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