import React, { useState, useEffect } from "react";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonLoading,
    IonToast,
    InputChangeEventDetail,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
} from "@ionic/react";
import { useEmpresas } from "../context/EmpresasContext";
import { Empresa } from "../types/types";

const EmpresasList: React.FC = () => {
    const { empresas, fetchEmpresas, isLoading: contextLoading, error: contextError, clearError } = useEmpresas();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]);

    const handleSearchChange = (e: CustomEvent<InputChangeEventDetail>) => {
        setSearchTerm(e.detail.value ? String(e.detail.value) : "");
        // Al buscar, siempre se debe volver a la lista principal
        setSelectedEmpresa(null);
    };

    const handleShowDetails = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
    };

    const handleBackToList = () => {
        setSelectedEmpresa(null);
    };

    // Función para renderizar los detalles de la empresa, mostrando solo los campos con valor
    const renderEmpresaDetails = (empresa: Empresa) => {
        const details: { label: string; value: string | number | string[] | { lat: number; lng: number } | undefined | null }[] = [
            { label: "Dirección", value: empresa.direccion },
            { label: "Categoría", value: empresa.categoria },
            { label: "WhatsApp", value: empresa.whatsapp },
            { label: "Instagram", value: empresa.instagram ? `@${empresa.instagram}` : null },
            { label: "Descripción", value: empresa.descripcion },
            { label: "Teléfono", value: empresa.telefono },
            { label: "Email", value: empresa.email },
            { label: "URL Logo", value: empresa.logoUrl },
            { label: "Horario de Atención", value: empresa.horarioAtencion },
            { label: "Sitio Web", value: empresa.sitioWeb },
            { label: "Servicios", value: empresa.servicios && empresa.servicios.length > 0 ? empresa.servicios.join(', ') : null },
            { label: "Ubicación GPS", value: empresa.ubicacionGps && (empresa.ubicacionGps.lat !== 0 || empresa.ubicacionGps.lng !== 0) ? `Lat: ${empresa.ubicacionGps.lat}, Lng: ${empresa.ubicacionGps.lng}` : null },
            { label: "TikTok", value: empresa.tiktok ? `@${empresa.tiktok}` : null },
        ];

        return (
            <>
                {details.map((detail, index) => {
                    if (detail.value && detail.value !== 'N/A' &&
                        !(typeof detail.value === 'object' && 'lat' in detail.value && detail.value.lat === 0 && detail.value.lng === 0)) {
                        return (
                            <p key={index}>
                                <strong>{detail.label}:</strong>{" "}
                                {detail.label === "URL Logo" || detail.label === "Sitio Web" ? (
                                    <a href={String(detail.value)} target="_blank" rel="noopener noreferrer">
                                        {String(detail.value)}
                                    </a>
                                ) : (
                                    String(detail.value)
                                )}
                            </p>
                        );
                    }
                    return null;
                })}
            </>
        );
    };

    const filteredEmpresas = empresas.filter((empresa) =>
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {/* No hay botones en la barra superior asociados a esta página */}
                    <IonTitle>Empresas</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                {selectedEmpresa ? (
                    // Vista de detalles de una empresa
                    <IonCard className="ion-margin-top">
                        <IonCardHeader>
                            <IonCardTitle>Detalles de: <strong>{selectedEmpresa.nombre}</strong></IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            {renderEmpresaDetails(selectedEmpresa)}
                            <IonButton expand="block" color="medium" onClick={handleBackToList} className="ion-margin-top">
                                Volver
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                ) : (
                    // Vista de lista de empresas
                    <>
                        <IonItem>
                            <IonLabel position="floating">Buscar Empresa</IonLabel>
                            <IonInput
                                value={searchTerm}
                                onIonChange={handleSearchChange}
                                maxlength={50}
                            />
                        </IonItem>

                        {filteredEmpresas.length > 0 ? (
                            filteredEmpresas.map((empresa) => (
                                <IonCard key={empresa.id} button onClick={() => handleShowDetails(empresa)} className="ion-margin-top">
                                    <IonCardHeader>
                                        <IonCardTitle>{empresa.nombre}</IonCardTitle>
                                    </IonCardHeader>
                                    {/* La IonCardContent se elimina para mostrar solo el nombre en la lista */}
                                </IonCard>
                            ))
                        ) : (
                            <IonItem>
                                <IonLabel>No hay empresas para mostrar.</IonLabel>
                            </IonItem>
                        )}
                    </>
                )}

                <IonLoading isOpen={contextLoading} message={"Cargando empresas..."} />
                <IonToast
                    isOpen={!!contextError}
                    message={contextError || ""}
                    duration={3000}
                    onDidDismiss={clearError}
                    color="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default EmpresasList;