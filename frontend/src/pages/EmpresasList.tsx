import React, { useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { useEmpresas } from "../EmpresasContext"; // Importa el hook useEmpresas

const EmpresasList: React.FC = () => {
  const { empresas, fetchEmpresas } = useEmpresas(); // Usa el hook para acceder al estado y a la función fetchEmpresas

  useEffect(() => {
    fetchEmpresas(); // Llama a la función fetchEmpresas al montar el componente
  }, [fetchEmpresas]);

  return (
    <IonPage placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <IonHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <IonToolbar placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <IonTitle placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Lista de Empresas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <IonList placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {empresas.map((empresa, index) => (
            <IonCard key={index} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonCardHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <IonCardTitle placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{empresa.nombre}</IonCardTitle>
                <IonCardSubtitle placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{empresa.categoria}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <p>Dirección: {empresa.direccion}</p>
                <p>WhatsApp: {empresa.whatsapp}</p>
                <p>Instagram: {empresa.instagram}</p>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default EmpresasList;

