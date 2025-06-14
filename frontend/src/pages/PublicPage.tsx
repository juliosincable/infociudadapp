import React from 'react';
import { 
    IonContent, 
    IonPage, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonText,
    IonButton,
    IonIcon
} from '@ionic/react';
import { playCircleOutline } from 'ionicons/icons'; // Icono para un botón de acción

const PublicPage: React.FC = () => {
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
              
              <IonButton expand="block" size="large" className="ion-margin-top" color="tertiary">
                <IonIcon slot="start" icon={playCircleOutline} />
                Comenzar Exploración
              </IonButton>

              <IonText color="medium" className="ion-margin-top">
                <p>Esta es una plantilla de prueba básica. No se están cargando datos externos.</p>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default PublicPage;