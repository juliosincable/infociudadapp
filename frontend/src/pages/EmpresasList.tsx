// src/pages/EmpresasList.tsx

import * as React from "react";
import { useState, useEffect, useCallback } from "react"; // Añadimos useCallback
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
import { add, search, refresh, create } from "ionicons/icons"; // Asegúrate de importar 'create'
import { useEmpresas } from "../EmpresasContext";
import { Empresa } from "../types";

const EmpresasList: React.FC = () => {
    const { empresas, fetchEmpresas, isLoading: contextLoading, error: contextError } = useEmpresas();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Para control de carga local
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Para mensajes de error locales

    // Usamos useCallback para envolver cargarEmpresas, lo que garantiza que la función sea estable
    // y no cause re-renders innecesarios en useEffect si fetchEmpresas del contexto es estable.
    const cargarEmpresas = useCallback(async () => {
        setIsLoading(true); // Activa el estado de carga local
        try {
            await fetchEmpresas(); // Llama a la función del contexto
        } catch (error) {
            console.error("Error al cargar empresas:", error);
            setErrorMessage("Error al cargar empresas. Intente nuevamente."); // Configura el mensaje de error local
        } finally {
            setIsLoading(false); // Desactiva el estado de carga local
        }
    }, [fetchEmpresas]); // Depende de fetchEmpresas para que se re-cree si cambia

    useEffect(() => {
        // Llama a la función de carga al montar el componente
        cargarEmpresas();
    }, [cargarEmpresas]); // Depende de cargarEmpresas

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
                    <IonButton slot="end" onClick={() => cargarEmpresas()}>
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

                {/* Combina estados de carga y error del contexto y locales */}
                <IonLoading isOpen={isLoading || contextLoading} message={"Cargando..."} />
                <IonToast
                    isOpen={!!(errorMessage || contextError)}
                    message={errorMessage || contextError || ""}
                    duration={3000}
                    onDidDismiss={() => setErrorMessage(null)}
                    color="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default EmpresasList;