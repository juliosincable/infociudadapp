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
    IonCard,
    IonCardHeader,
    IonCardContent,
} from "@ionic/react";
import { add, search, refresh, create, close } from "ionicons/icons";
import { useEmpresas } from "../EmpresasContext";
import { useTheme } from "../theme/ThemeContext";
import { Empresa } from "../types"; // Asegúrate de que esta ruta sea correcta

const EmpresasList: React.FC = () => {
    const { empresas, fetchEmpresas, isLoading: contextLoading, error: contextError, clearError } = useEmpresas(); // Añadido clearError
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

    useEffect(() => {
        fetchEmpresas();
        // Opcional: Si quieres que los detalles se cierren cada vez que se recarga la lista
        // setSelectedEmpresa(null); 
    }, [fetchEmpresas]);

    const handleSearchChange = (e: CustomEvent<InputChangeEventDetail>) => {
        setSearchTerm(e.detail.value ? String(e.detail.value) : "");
        setSelectedEmpresa(null); // Cuando se busca, reinicia la empresa seleccionada
    };

    const handleShowDetails = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
        // Punto de depuración: Imprime la empresa seleccionada para verificar sus campos
        console.log("Empresa seleccionada para detalles:", empresa);
    };

    const handleCloseDetails = () => {
        setSelectedEmpresa(null);
    };

    const filteredEmpresas = empresas.filter((empresa) =>
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // MODIFICACIÓN: Comprobación de existencia para campos opcionales
        (empresa.categoria && empresa.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (empresa.descripcion && empresa.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (empresa.telefono && empresa.telefono.includes(searchTerm))
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

                {/* SECCIÓN DE DETALLES DE EMPRESA SELECCIONADA */}
                {selectedEmpresa && (
                    <IonCard className="ion-margin-top">
                        <IonCardHeader>
                            <h2>Detalles de: <strong>{selectedEmpresa.nombre}</strong></h2>
                        </IonCardHeader>
                        <IonCardContent>
                            {/* Mostrar todos los campos, incluso si son opcionales, para que se vea el título del campo */}
                            <p><strong>Dirección:</strong> {selectedEmpresa.direccion || 'N/A'}</p>
                            <p><strong>Categoría:</strong> {selectedEmpresa.categoria || 'N/A'}</p>
                            <p><strong>WhatsApp:</strong> {selectedEmpresa.whatsapp || 'N/A'}</p>
                            <p><strong>Instagram:</strong> {selectedEmpresa.instagram || 'N/A'}</p>

                            {/* CAMPOS ADICIONALES: Ahora se muestran incluso si están vacíos, con 'N/A' */}
                            <p><strong>Descripción:</strong> {selectedEmpresa.descripcion || 'N/A'}</p>
                            <p><strong>Teléfono:</strong> {selectedEmpresa.telefono || 'N/A'}</p>
                            <p><strong>Email:</strong> {selectedEmpresa.email || 'N/A'}</p>
                            <p><strong>URL Logo:</strong> {selectedEmpresa.logoUrl ? <a href={selectedEmpresa.logoUrl} target="_blank" rel="noopener noreferrer">{selectedEmpresa.logoUrl}</a> : 'N/A'}</p>
                            <p><strong>Horario de Atención:</strong> {selectedEmpresa.horarioAtencion || 'N/A'}</p>
                            <p><strong>Sitio Web:</strong> {selectedEmpresa.sitioWeb ? <a href={selectedEmpresa.sitioWeb} target="_blank" rel="noopener noreferrer">{selectedEmpresa.sitioWeb}</a> : 'N/A'}</p>
                            <p><strong>Servicios:</strong> {selectedEmpresa.servicios && selectedEmpresa.servicios.length > 0 ? selectedEmpresa.servicios.join(', ') : 'N/A'}</p>
                            <p><strong>Ubicación GPS:</strong> {selectedEmpresa.ubicacionGps && (selectedEmpresa.ubicacionGps.lat !== 0 || selectedEmpresa.ubicacionGps.lng !== 0) ? `Lat: ${selectedEmpresa.ubicacionGps.lat}, Lng: ${selectedEmpresa.ubicacionGps.lng}` : 'N/A'}</p>
                            <p><strong>TikTok:</strong> {selectedEmpresa.tiktok ? `@${selectedEmpresa.tiktok}` : 'N/A'}</p>

                            <IonButton expand="block" color="medium" onClick={handleCloseDetails} className="ion-margin-top">
                                <IonIcon slot="start" icon={close} />
                                Cerrar Detalles
                            </IonButton>
                            <IonButton
                                expand="block"
                                routerLink={`/admin/empresas/form/${selectedEmpresa.id}`}
                                className="ion-margin-top"
                            >
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
                                    {/* SOLO EL NOMBRE EN LA LISTA */}
                                    <h2>{empresa.nombre}</h2>
                                </IonLabel>
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
                    onDidDismiss={clearError} // Ahora usa la función clearError del contexto
                    color="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default EmpresasList;