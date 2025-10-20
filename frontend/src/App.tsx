// src/App.tsx

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
    IonContent,
    IonList,
    IonItem,
    IonLabel
} from '@ionic/react';

// Importamos solo IonReactRouter de '@ionic/react-router'
import { IonReactRouter } from '@ionic/react-router';
// 🛑 NO USAMOS 'Switch' aquí, ya que IonTabs maneja rutas anidadas mejor sin él.
import { Route, Redirect, useHistory } from 'react-router-dom';

import Home from './pages/Home';
import EmpresasForm from './pages/EmpresasForm';
import EmpresasList from './pages/EmpresasList';
import PublicPage from './pages/PublicPage';

import { EmpresasProvider } from "./context/EmpresasContext";
import { ThemeProvider } from "./theme/ThemeContext";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
// ... (resto de importaciones CSS)
import './theme/variables.scss';

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
                            {/* 🛑 ATENCIÓN: Al hacer push a '/home', el router de Home.tsx tomará el control. 
                                Si quieres saltar directamente a una pestaña, usa la ruta completa, ej: '/home/admin' */}
                            <IonItem button onClick={() => history.push('/publicpage')} lines="none">
                                <IonLabel>Inicio Público</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => history.push('/home')} lines="none">
                                <IonLabel>Home Admin (Pestañas)</IonLabel>
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
                <IonRouterOutlet id="main-content">
                    {/* 🛑 NO USAMOS <Switch> */}
                        
                        {/* 🛑 ATENCIÓN: La ruta de Home debe ser capaz de manejar sub-rutas como /home/admin */}
                        <Route path="/home" component={Home} /> 
                        <Route path="/empresas" component={EmpresasForm} exact={true} />
                        <Route path="/empresas/:id" component={EmpresasForm} />
                        <Route path="/empresasList" component={EmpresasList} exact={true} />
                        <Route path="/publicpage" component={PublicPage} exact={true} />
                        <Redirect from="/" to="/publicpage" exact={true} />
                    
                </IonRouterOutlet>
            </div>
        </IonSplitPane>
    );
};

// 🛑 Aplicamos React.memo al componente que contiene el SplitPane/RouterOutlet
const MemoizedAppContent = React.memo(AppContent);

const App: React.FC = () => (
    <IonApp>
        <ThemeProvider>
            <EmpresasProvider>
                <IonReactRouter>
                    <MemoizedAppContent /> 
                </IonReactRouter>
            </EmpresasProvider>
        </ThemeProvider>
    </IonApp>
);

export default App;