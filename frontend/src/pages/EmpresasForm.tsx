import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonList,
} from "@ionic/react";
import { useEmpresas } from "../EmpresasContext";

const EmpresasForm: React.FC = () => {
  const { createEmpresa } = useEmpresas();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nombreEmpresa, setNombreEmpresa] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaEmpresa = {
      nombre: name,
      email,
      nombreEmpresa,
      direccion,
      categoria,
      whatsapp,
      instagram
    };
    createEmpresa(nuevaEmpresa);
    console.log("Empresa agregada:", nuevaEmpresa);
  };

  return (
    <IonPage placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <IonHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <IonToolbar placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <IonTitle placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Formulario de Empresa</IonTitle>
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
            <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Nombre de la Empresa</IonLabel>
              <IonInput value={nombreEmpresa} onIonChange={(e) => setNombreEmpresa(e.detail.value!)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </IonItem>
            <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Dirección</IonLabel>
              <IonInput value={direccion} onIonChange={(e) => setDireccion(e.detail.value!)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </IonItem>
            <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Categoría</IonLabel>
              <IonInput value={categoria} onIonChange={(e) => setCategoria(e.detail.value!)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </IonItem>
            <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>WhatsApp</IonLabel>
              <IonInput value={whatsapp} onIonChange={(e) => setWhatsapp(e.detail.value!)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </IonItem>
            <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Instagram</IonLabel>
              <IonInput value={instagram} onIonChange={(e) => setInstagram(e.detail.value!)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </IonItem>
            <IonButton type="submit" expand="block" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Enviar</IonButton>
          </IonList>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default EmpresasForm;

