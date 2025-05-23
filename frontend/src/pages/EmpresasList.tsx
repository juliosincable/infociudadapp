// src/pages/EmpresasList.tsx

import * as React from "react";
import { useState, useEffect } from "react"; // Eliminamos useCallback de aquí si solo lo usaremos para la carga inicial
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
import { Empresa } from "../types";

const EmpresasList: React.FC = () => {
    // Usamos directamente los estados de empresas, fetchEmpresas, isLoading y error del contexto
    const { empresas, fetchEmpresas, isLoading: contextLoading, error: contextError } = useEmpresas();
    const [searchTerm, setSearchTerm] = useState("");
    
    // *** ELIMINAMOS los estados isLoading y errorMessage locales, ya que el contexto los proporciona ***
    // const [isLoading, setIsLoading] = useState(false);
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Usamos useEffect para cargar empresas cuando el componente se monta
    useEffect(() => {
        // Llama a fetchEmpresas directamente desde el contexto
        // Esto es seguro porque fetchEmpresas en el contexto está envuelto en useCallback
        fetchEmpresas();
    }, [fetchEmpresas]); // Depende de fetchEmpresas, que es estable gracias a useCallback en el contexto

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
                    <IonButton slot="end" onClick={() => fetchEmpresas()}> {/* Llamada directa a fetchEmpresas del contexto */}
                        <IonIcon icon={refresh} />
                    </IonButton>
                    <IonButton slot="end" routerLink="/admin/empresas/form">
                        <IonIcon icon={add} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
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

                {/* Usamos directamente los estados de carga y error del contexto */}
                <IonLoading isOpen={contextLoading} message={"Cargando empresas..."} />
                <IonToast
                    isOpen={!!contextError} // La tostada se abre si hay un error del contexto
                    message={contextError || ""}
                    duration={3000}
                    onDidDismiss={() => {}} // No hacemos nada aquí, el contexto se encarga de limpiar su error
                    color="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default EmpresasList;