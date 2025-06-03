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
    IonCard, // Importa IonCard
    IonCardHeader, // Importa IonCardHeader
    IonCardContent, // Importa IonCardContent
} from "@ionic/react";
import { add, search, refresh, create, close } from "ionicons/icons"; // Añade 'close' para el botón de cerrar detalles
import { useEmpresas } from "../EmpresasContext";
import { useTheme } from "../theme/ThemeContext";
import { Empresa } from "../types";

const EmpresasList: React.FC = () => {
    const { empresas, fetchEmpresas, isLoading: contextLoading, error: contextError } = useEmpresas();
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    // Nuevo estado para la empresa seleccionada y sus detalles
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]);

    const handleSearchChange = (e: CustomEvent<InputChangeEventDetail>) => {
        setSearchTerm(e.detail.value ? String(e.detail.value) : "");
        // Cuando se busca, reinicia la empresa seleccionada
        setSelectedEmpresa(null);
    };

    // Función para mostrar los detalles de una empresa
    const handleShowDetails = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
    };

    // Función para cerrar los detalles de una empresa
    const handleCloseDetails = () => {
        setSelectedEmpresa(null);
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

                {/* Mostrar los detalles completos de la empresa seleccionada */}
                {selectedEmpresa && (
                    <IonCard className="ion-margin-top">
                        <IonCardHeader>
                            <h2>Detalles de: <strong>{selectedEmpresa.nombre}</strong></h2>
                        </IonCardHeader>
                        <IonCardContent>
                            <p><strong>Dirección:</strong> {selectedEmpresa.direccion}</p>
                            <p><strong>Categoría:</strong> {selectedEmpresa.categoria}</p>
                            <p><strong>WhatsApp:</strong> {selectedEmpresa.whatsapp}</p>
                            <p><strong>Instagram:</strong> {selectedEmpresa.instagram}</p>
                            <IonButton expand="block" color="medium" onClick={handleCloseDetails} className="ion-margin-top">
                                <IonIcon slot="start" icon={close} />
                                Cerrar Detalles
                            </IonButton>
                             {/* Puedes agregar un botón de edición aquí si quieres, o solo permitir ver */}
                            <IonButton expand="block" routerLink={`/admin/empresas/form/${selectedEmpresa.id}`} className="ion-margin-top">
                                <IonIcon slot="start" icon={create} />
                                Editar Empresa
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                )}

                <IonList className="ion-margin-top">
                    {filteredEmpresas.length > 0 ? (
                        filteredEmpresas.map((empresa) => (
                            <IonItem key={empresa.id} button onClick={() => handleShowDetails(empresa)}>
                                <IonLabel>
                                    {/* Muestra solo el nombre de la empresa */}
                                    <h2>{empresa.nombre}</h2>
                                </IonLabel>
                                {/* El botón de edición se mantiene aquí, pero ahora también puedes acceder a él desde la vista de detalles */}
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