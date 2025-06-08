// frontend/src/pages/Home.tsx

import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonList,
} from "@ionic/react";

// ¡ASEGÚRATE DE QUE ESTA LÍNEA NO ESTÉ!
// import "./Home.css"; 

const Home: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Bienvenido a InfoCiudad Admin</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <div className="home-container">
                    <h1>Gestión de Empresas</h1>
                    <p>Usa el menú lateral para navegar por las opciones de administración.</p>
                    <IonList>
                        <IonItem routerLink="/empresas" button>
                            <IonLabel>
                                <h2>Administrar Empresas</h2>
                                <p>Agrega, edita o elimina información de empresas.</p>
                            </IonLabel>
                        </IonItem>
                        <IonItem routerLink="/empresasList" button>
                            <IonLabel>
                                <h2>Ver Listado de Empresas</h2>
                                <p>Visualiza todas las empresas registradas.</p>
                            </IonLabel>
                        </IonItem>
                    </IonList>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;
