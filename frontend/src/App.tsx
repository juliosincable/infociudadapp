// src/App.tsx
import React from 'react';
// Importamos BrowserRouter, Route, Switch, Redirect, useHistory de 'react-router-dom'
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom'; 
import { 
    IonApp, 
    IonRouterOutlet, 
    setupIonicReact, 
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonButtons,    
    IonButton,     
    IonIcon,       
    IonMenu,       
    IonContent,    
    IonList,       
    IonItem,       
    IonLabel,      
    IonMenuToggle, 
    IonSplitPane   
} from '@ionic/react';
// Solo IonReactRouter de @ionic/react-router para envolver
import { IonReactRouter } from '@ionic/react-router'; 

import { menu as menuIcon } from 'ionicons/icons'; 

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
  const history = useHistory(); // useHistory desde 'react-router-dom'

  return (
    <IonSplitPane contentId="main-content" when="false"> 
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

      <div className="ion-page" id="main-content"> 
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start" className="ion-hide-md-up"> 
              <IonMenuToggle>
                <IonButton>
                  <IonIcon slot="icon-only" icon={menuIcon} />
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
            
            <IonTitle>InfoCiudad</IonTitle>

            <IonButtons slot="end" className="ion-hide-md-down"> 
              <IonButton onClick={() => history.push('/publicpage')}>
                Inicio Público
              </IonButton>
              <IonButton onClick={() => history.push('/home')}>
                Home Admin
              </IonButton>
              <IonButton onClick={() => history.push('/empresas')}>
                Form Empresas
              </IonButton>
              <IonButton onClick={() => history.push('/empresasList')}>
                Lista Empresas
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonRouterOutlet basePath="/" ionPage={true} {...({} as any)}>
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