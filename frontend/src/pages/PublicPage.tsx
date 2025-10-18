import React, { useState } from 'react';
import { 
    IonContent, 
    IonPage, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonText,
    IonButton,
    IonIcon,
    // Importamos el hook de ciclo de vida de Ionic React
    useIonViewWillEnter 
} from '@ionic/react';
import { playCircleOutline } from 'ionicons/icons'; // Icono para un botón de acción

const PublicPage: React.FC = () => {
    // 1. Definir un estado para almacenar la información que queremos actualizar
    const [lastEntryTime, setLastEntryTime] = useState<string | null>(null);

    // 2. Usar useIonViewWillEnter para ejecutar la lógica de actualización
    useIonViewWillEnter(() => {
        // Obtenemos la hora actual
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        // Actualizamos el estado, forzando la re-renderización con datos frescos
        setLastEntryTime(timeString);
        
        // Console.log de prueba para ver cuándo se ejecuta
        console.log(`[PublicPage] Se ejecutó useIonViewWillEnter a las: ${timeString}`);
    });

    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding ion-text-center">
                {/* Contenido principal de la landing page */}
                <IonGrid style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <IonRow className="ion-justify-content-center ion-align-items-center" style={{ width: '100%' }}>
                        <IonCol size="12" size-md="8" size-lg="6">
                            <IonText color="primary">
                                <h1 className="ion-padding-top">Bienvenido a InfoCiudad</h1>
                            </IonText>
                            <IonText color="dark">
                                <p>Tu guía local para descubrir las mejores empresas y servicios en tu ciudad.</p>
                                <p>¡Explora y encuentra todo lo que necesitas al alcance de tu mano!</p>
                            </IonText>
                            
                            {/* Mostrar la hora de la última entrada (dato dinámico) */}
                            <IonText color="success">
                                <h3>
                                    {lastEntryTime 
                                        ? `Última carga de vista: ${lastEntryTime}` 
                                        : 'Cargando...'}
                                </h3>
                            </IonText>

                            <IonButton expand="block" size="large" className="ion-margin-top" color="tertiary" routerLink="/empresasList">
                                <IonIcon slot="start" icon={playCircleOutline} />
                                Comenzar Exploración (Ir a otra página)
                            </IonButton>

                            <IonText color="medium" className="ion-margin-top">
                                <p>Esta es una plantilla de prueba básica. Este texto se actualizará cada vez que vuelvas a esta página, gracias a `useIonViewWillEnter`.</p>
                            </IonText>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default PublicPage;