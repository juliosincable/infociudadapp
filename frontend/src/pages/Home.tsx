import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useTheme } from '../theme/ThemeContext'; // Importamos useTheme

const Home: React.FC = () => (
  <IonPage {...({} as any)}>
    <IonHeader {...({} as any)}>
      <IonToolbar {...({} as any)}>
        <IonTitle {...({} as any)}>infoCiudadapp</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen={true as any} {...({} as any)}>
      <IonHeader collapse="condense" {...({} as any)}>
        <IonToolbar {...({} as any)}>
          <IonTitle size="large" {...({} as any)}>infoCiudadapp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <ExploreContainer {...({} as any)} />
    </IonContent>
  </IonPage>
);

export default Home;

