// src/pages/HomeAdminContent.tsx

import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

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

export default HomeAdminContent;