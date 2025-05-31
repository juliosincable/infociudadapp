// src/pages/PublicPage.tsx
import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { useTheme } from '../theme/ThemeContext'; // Importamos useTheme

const PublicPage: React.FC = () => {
  // Ahora solo accedemos a 'theme', no a 'toggleTheme'
  const { theme } = useTheme(); 

  return (
    <IonPage>
      {/* El IonHeader ya no necesita el botón de tema aquí, ya que se maneja automáticamente en App.tsx */}
      {/* Si tenías un IonHeader aquí con un botón de tema, ese botón debe ser eliminado */}
      <IonContent fullscreen className="ion-padding">
        <IonText className="welcome-text">
          <h1>¡Bienvenido a InfoCiudad!</h1>
          <p>Tu guía definitiva para encontrar todo lo que necesitas en nuestra ciudad.</p>
        </IonText>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>¿Qué puedes encontrar aquí?</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ul>
              <li>Empresas y negocios locales.</li>
              <li>Servicios profesionales.</li>
              <li>Eventos y actividades culturales.</li>
            </ul>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Explora y Conecta</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>Usa la navegación para descubrir lo que nuestra ciudad tiene para ofrecer. ¡Encuentra lo que buscas o publica tu propio negocio!</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>¿Eres un negocio local?</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>¡Únete a nuestra plataforma y haz que tu negocio sea visible para miles de personas! Contáctanos para más información sobre cómo registrarte.</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Puedes mostrar el tema actual si lo deseas, pero no es interactivo */}
        <IonText className="ion-text-center ion-padding-vertical">
          <p>Modo actual: {theme === 'dark' ? 'Oscuro' : 'Claro'}</p>
        </IonText>

      </IonContent>
    </IonPage>
  );
};

export default PublicPage;