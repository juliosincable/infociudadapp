import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

const MainContainer: React.FC<any> = ({ children }) => {
    return (
        // La clase 'main-container' es donde aplicamos los estilos CSS
        // que lo centran y le dan el borde solo en desktop.
        <IonGrid fixed className="ion-no-padding main-container">
            <IonRow>
                <IonCol className="ion-no-padding">
                    {children}
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default MainContainer;