import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonText,
} from "@ionic/react";
import "./PublicPage.css";

const PublicPage: React.FC = () => (
  <IonPage placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
    <IonHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <IonToolbar placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <IonTitle placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>infoCiudadapp</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <IonText placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <h2>¡Explora lo mejor de nuestra ciudad!</h2>
        <p>
          Descubre lugares increíbles, eventos emocionantes y mucho más en
          infoCiudadapp.
        </p>
      </IonText>
      <div className="cards-container">
        <div className="card">
          <IonText placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <h3>Lugar Increíble 1</h3>
            <p>Descripción del lugar 1.</p>
          </IonText>
        </div>
        <div className="card">
          <IonText placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <h3>Lugar Increíble 2</h3>
            <p>Descripción del lugar 2.</p>
          </IonText>
        </div>
        <div className="card">
          <IonText placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <h3>Lugar Increíble 3</h3>
            <p>Descripción del lugar 3.</p>
          </IonText>
        </div>
      </div>
    </IonContent>
    <IonFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <IonToolbar placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <IonText className="ion-padding" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          &copy; 2025 infoCiudadapp. Todos los derechos reservados.
        </IonText>
      </IonToolbar>
    </IonFooter>
  </IonPage>
);

export default PublicPage;
