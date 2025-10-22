// src/pages/Home.tsx (El contenedor de Pestañas con implementación estricta)

import React from 'react';
// 🛑 CORRECCIÓN: Eliminamos 'home as homeIcon' y usamos 'playCircle'
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom'; 

// Importa los íconos
// 🛑 Solo importamos los que se utilizan en los IonTabButton.
import { playCircle, radio, library, search } from 'ionicons/icons';

// Importa las "sub-páginas" que se mostrarán en cada pestaña
// RECUERDA: Tus componentes reales (EmpresasForm, EmpresasList, PublicPage)
// DEBEN tener su propia estructura de IonPage, IonHeader y IonContent.
const HomeAdminContent: React.FC = () => (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Home Admin</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <h1>Bienvenido, Administrador</h1>
            <p>Esta es la página principal de la vista de pestañas.</p>
        </IonContent>
    </IonPage>
);

// Componentes reales (asumiendo que tienen su estructura de IonPage completa)
import EmpresasForm from './EmpresasForm';
import EmpresasList from './EmpresasList';
import PublicPage from './PublicPage';


const Home: React.FC = () => {
    // 🛑 USAMOS useRouteMatch para obtener el 'path' base actual (/home)
    const { path } = useRouteMatch();

    return (
        <IonTabs>
            
            <IonRouterOutlet>
                {/* CORRECCIÓN CLAVE: Redirigimos desde la ruta base al primer tab, usando 'path' */}
                <Redirect exact path={path} to={`${path}/admin`} /> 
                
                {/* Rutas de las pestañas: Usamos `${path}` para construir las rutas anidadas */}
                <Route path={`${path}/admin`} render={() => <HomeAdminContent />} exact={true} />
                <Route path={`${path}/form`} render={() => <EmpresasForm />} exact={true} />
                <Route path={`${path}/list`} render={() => <EmpresasList />} exact={true} />
                <Route path={`${path}/public`} render={() => <PublicPage />} exact={true} />
            </IonRouterOutlet>

            {/* La barra de pestañas real de Ionic */}
            <IonTabBar slot="bottom">
                
                {/* Botón 1: Admin */}
                <IonTabButton tab="admin" href={`${path}/admin`}>
                    <IonIcon icon={playCircle} /> 
                    <IonLabel>Admin</IonLabel>
                </IonTabButton>

                {/* Botón 2: Formulario (Activa la vista al formulario) */}
                <IonTabButton tab="form" href={`${path}/form`}>
                    <IonIcon icon={radio} />
                    <IonLabel>Formulario</IonLabel>
                </IonTabButton>

                {/* Botón 3: Lista */}
                <IonTabButton tab="list" href={`${path}/list`}>
                    <IonIcon icon={library} />
                    <IonLabel>Lista</IonLabel>
                </IonTabButton>

                {/* Botón 4: Público */}
                <IonTabButton tab="public" href={`${path}/public`}>
                    <IonIcon icon={search} />
                    <IonLabel>Público</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
}

export default Home;