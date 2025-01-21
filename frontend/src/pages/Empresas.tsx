import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonList } from '@ionic/react';

const FormComponent: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Name:', name);
    console.log('Email:', email);
  };

  return (
    <IonPage placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <IonHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <IonToolbar placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <IonTitle placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Formulario Básico</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <form onSubmit={handleSubmit}>
          <IonList placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Nombre</IonLabel>
              <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </IonItem>
            <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Correo Electrónico</IonLabel>
              <IonInput value={email} onIonChange={(e) => setEmail(e.detail.value!)} type="email" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </IonItem>
            <IonButton type="submit" expand="block" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Enviar</IonButton>
          </IonList>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default FormComponent;


