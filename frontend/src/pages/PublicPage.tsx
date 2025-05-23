// src/pages/PublicPage.tsx

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonFooter } from '@ionic/react';
import './PublicPage.css'; // Asegúrate de que el CSS existe y es relevante

const PublicPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>InfoCiudad</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonText className="welcome-text">
          <h1>¡Bienvenido a InfoCiudad!</h1>
          <p>
            Tu guía definitiva para encontrar todo lo que necesitas en nuestra ciudad.
          </p>
        </IonText>

        <IonText className="info-section">
          <h2>¿Qué puedes encontrar aquí?</h2>
          <ul>
            <li>Empresas y negocios locales.</li>
            <li>Servicios profesionales.</li>
            <li>Eventos y actividades culturales.</li>
          </ul>
        </IonText>

        <IonText className="call-to-action">
          <h2>Explora y Conecta</h2>
          <p>
            Usa la navegación para descubrir lo que nuestra ciudad tiene para ofrecer.
            ¡Encuentra lo que buscas o publica tu propio negocio!
          </p>
        </IonText>

        <IonText className="feature-highlight">
          <h2>¿Eres un negocio local?</h2>
          <p>
            ¡Únete a nuestra plataforma y haz que tu negocio sea visible para miles de personas!
            Contáctanos para más información sobre cómo registrarte.
          </p>
        </IonText>

      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonText className="ion-text-center ion-padding-vertical">
            &copy; {new Date().getFullYear()} InfoCiudad. Todos los derechos reservados.
          </IonText>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default PublicPage;