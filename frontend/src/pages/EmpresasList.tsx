// src/pages/EmpresasList.tsx

import * as React from "react";
import { useState, useEffect } from "react";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonLoading,
    IonToast,
    InputChangeEventDetail,
} from "@ionic/react";
import { add, search, refresh, create } from "ionicons/icons";
import { useEmpresas } from "../EmpresasContext";
import { useTheme } from "../theme/ThemeContext"; // ¡Importamos el hook del tema!
import { Empresa } from "../types";

const EmpresasList: React.FC = () => {
    const { empresas, fetchEmpresas, isLoading: contextLoading, error: contextError } = useEmpresas();
    // Eliminamos 'toggleTheme' de la desestructuración, ya que el tema es automático
    const { theme } = useTheme(); 
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]);

    const handleSearchChange = (e: CustomEvent<InputChangeEventDetail>) => {
        setSearchTerm(e.detail.value ? String(e.detail.value) : "");
    };

    const filteredEmpresas = empresas.filter((empresa) =>
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Listado de Empresas</IonTitle>
                    <IonButton slot="end" onClick={() => fetchEmpresas()}>
                        <IonIcon icon={refresh} />
                    </IonButton>
                    <IonButton slot="end" routerLink="/admin/empresas/form">
                        <IonIcon icon={add} />
                    </IonButton>
                    {/* El botón de tema ha sido eliminado de aquí, ya que el tema es automático */}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonItem>
                    <IonLabel position="floating">Buscar Empresa</IonLabel>
                    <IonInput
                        value={searchTerm}
                        onIonChange={handleSearchChange}
                        maxlength={50}
                    />
                    <IonIcon slot="end" icon={search} />
                </IonItem>

                <IonList>
                    {filteredEmpresas.length > 0 ? (
                        filteredEmpresas.map((empresa) => (
                            <IonItem key={empresa.id}>
                                <IonLabel>
                                    <h2>{empresa.nombre}</h2>
                                    <p>Dirección: {empresa.direccion}</p>
                                    <p>Categoría: {empresa.categoria}</p>
                                    <p>WhatsApp: {empresa.whatsapp}</p>
                                    <p>Instagram: {empresa.instagram}</p>
                                </IonLabel>
                                <IonButton slot="end" routerLink={`/admin/empresas/form/${empresa.id}`}>
                                    <IonIcon icon={create} />
                                </IonButton>
                            </IonItem>
                        ))
                    ) : (
                        <IonItem>
                            <IonLabel>No hay empresas para mostrar.</IonLabel>
                        </IonItem>
                    )}
                </IonList>

                <IonLoading isOpen={contextLoading} message={"Cargando empresas..."} />
                <IonToast
                    isOpen={!!contextError}
                    message={contextError || ""}
                    duration={3000}
                    onDidDismiss={() => {}}
                    color="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default EmpresasList;
