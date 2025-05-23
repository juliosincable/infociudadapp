import * as React from "react";
import { useState, useEffect } from "react";
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
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonIcon,
    IonLoading,
    IonToast,
    InputChangeEventDetail,
} from "@ionic/react";
import { create, save, close, trash } from "ionicons/icons"; // Agrega 'trash' para eliminar
import { useEmpresas } from "../EmpresasContext";
import { Empresa } from "../types"; // Asegúrate de importar Empresa desde aquí

const EmpresasForm: React.FC = () => {
    // Desestructuramos deleteEmpresa también
    const { empresas, fetchEmpresas, updateEmpresa, createEmpresa, deleteEmpresa } = useEmpresas();

    const [formData, setFormData] = useState<Omit<Empresa, "id">>({
        nombre: "",
        direccion: "",
        categoria: "",
        whatsapp: "",
        instagram: "",
    });

    const [editandoId, setEditandoId] = useState<string>("");
    const [empresaEditando, setEmpresaEditando] = useState<Empresa | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        cargarEmpresas();
    }, [fetchEmpresas]); // Agrega fetchEmpresas como dependencia estable

    const cargarEmpresas = async () => {
        setIsLoading(true);
        try {
            await fetchEmpresas();
        } catch (error) {
            console.error("Error al cargar empresas:", error);
            setErrorMessage("Error al cargar empresas. Intente nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (key: keyof Omit<Empresa, "id">, value: string | null | undefined) => {
        setFormData((prevData) => ({ ...prevData, [key]: value || "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createEmpresa(formData);
            setFormData({
                nombre: "",
                direccion: "",
                categoria: "",
                whatsapp: "",
                instagram: "",
            });
            await fetchEmpresas(); // Recargar después de crear
        } catch (error) {
            console.error("Error al crear empresa:", error);
            setErrorMessage("Error al crear empresa. Intente nuevamente.");
        }
    };

    const iniciarEdicion = (empresa: Empresa) => {
        setEditandoId(empresa.id);
        setEmpresaEditando({ ...empresa }); // Copia completa de la empresa
    };

    const cancelarEdicion = () => {
        setEditandoId("");
        setEmpresaEditando(null);
    };

    const handleEditInputChange = (key: keyof Empresa, value: string | null | undefined) => {
        setEmpresaEditando((prevEmpresa) => {
            if (prevEmpresa) {
                return { ...prevEmpresa, [key]: value || "" };
            }
            return prevEmpresa;
        });
    };

    const guardarEdicion = async () => {
        if (empresaEditando && editandoId) {
            setIsLoading(true);
            try {
                // *** CORRECCIÓN CLAVE AQUÍ: Pasamos empresaEditando (que es Empresa completa)
                await updateEmpresa(editandoId, empresaEditando);
                await fetchEmpresas(); // Recargar después de actualizar
                cancelarEdicion();
            } catch (error) {
                console.error("Error al actualizar empresa:", error);
                setErrorMessage("Error al actualizar empresa. Intente nuevamente.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        try {
            await deleteEmpresa(id);
            await fetchEmpresas(); // Recargar después de eliminar
        } catch (error) {
            console.error("Error al eliminar empresa:", error);
            setErrorMessage("Error al eliminar empresa. Intente nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Gestión de Empresas</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* Formulario de Creación */}
                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonLabel position="floating">Nombre</IonLabel>
                        <IonInput
                            value={formData.nombre}
                            onIonChange={(e) => handleInputChange("nombre", e.detail.value)}
                            maxlength={20}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Dirección</IonLabel>
                        <IonInput
                            value={formData.direccion}
                            onIonChange={(e) => handleInputChange("direccion", e.detail.value)}
                            maxlength={20}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Categoría</IonLabel>
                        <IonInput
                            value={formData.categoria}
                            onIonChange={(e) => handleInputChange("categoria", e.detail.value)}
                            maxlength={20}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">WhatsApp</IonLabel>
                        <IonInput
                            value={formData.whatsapp}
                            onIonChange={(e) => handleInputChange("whatsapp", e.detail.value)}
                            maxlength={20}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Instagram</IonLabel>
                        <IonInput
                            value={formData.instagram}
                            onIonChange={(e) => handleInputChange("instagram", e.detail.value)}
                            maxlength={20}
                        />
                    </IonItem>
                    <IonButton type="submit" expand="block" color="primary">
                        Crear Empresa
                    </IonButton>
                </form>

                {/* Lista de Empresas */}
                <IonGrid>
                    <IonRow>
                        {empresas.map((empresa: Empresa) => (
                            <IonCol size="12" sizeMd="6" key={empresa.id}>
                                <IonCard>
                                    <IonCardHeader>
                                        <h2>{empresa.nombre}</h2>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {editandoId === empresa.id ? (
                                            <>
                                                <IonItem>
                                                    <IonLabel position="floating">Nombre</IonLabel>
                                                    <IonInput
                                                        value={empresaEditando?.nombre || ''}
                                                        onIonChange={(e) => handleEditInputChange("nombre", e.detail.value)}
                                                        maxlength={20}
                                                    />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel position="floating">Dirección</IonLabel>
                                                    <IonInput
                                                        value={empresaEditando?.direccion || ''}
                                                        onIonChange={(e) => handleEditInputChange("direccion", e.detail.value)}
                                                        maxlength={20}
                                                    />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel position="floating">Categoría</IonLabel>
                                                    <IonInput
                                                        value={empresaEditando?.categoria || ''}
                                                        onIonChange={(e) => handleEditInputChange("categoria", e.detail.value)}
                                                        maxlength={20}
                                                    />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel position="floating">WhatsApp</IonLabel>
                                                    <IonInput
                                                        value={empresaEditando?.whatsapp || ''}
                                                        onIonChange={(e) => handleEditInputChange("whatsapp", e.detail.value)}
                                                        maxlength={20}
                                                    />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel position="floating">Instagram</IonLabel>
                                                    <IonInput
                                                        value={empresaEditando?.instagram || ''}
                                                        onIonChange={(e) => handleEditInputChange("instagram", e.detail.value)}
                                                        maxlength={20}
                                                    />
                                                </IonItem>
                                                <IonButton onClick={guardarEdicion} expand="block" color="primary">
                                                    <IonIcon slot="start" icon={save} />
                                                    Guardar
                                                </IonButton>
                                                <IonButton onClick={cancelarEdicion} expand="block" color="medium">
                                                    <IonIcon slot="start" icon={close} />
                                                    Cancelar
                                                </IonButton>
                                            </>
                                        ) : (
                                            <>
                                                <p>
                                                    <strong>Dirección:</strong> {empresa.direccion}
                                                </p>
                                                <p>
                                                    <strong>Categoría:</strong> {empresa.categoria}
                                                </p>
                                                <p>
                                                    <strong>WhatsApp:</strong> {empresa.whatsapp}
                                                </p>
                                                <p>
                                                    <strong>Instagram:</strong> {empresa.instagram}
                                                </p>
                                                <IonButton onClick={() => iniciarEdicion(empresa)} expand="block">
                                                    <IonIcon slot="start" icon={create} />
                                                    Editar
                                                </IonButton>
                                                <IonButton onClick={() => handleDelete(empresa.id)} expand="block" color="danger">
                                                    <IonIcon slot="start" icon={trash} />
                                                    Eliminar
                                                </IonButton>
                                            </>
                                        )}
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>
                <IonLoading isOpen={isLoading} message={"Cargando..."} />
                <IonToast
                    isOpen={!!errorMessage}
                    message={errorMessage || ""}
                    duration={2000}
                    onDidDismiss={() => setErrorMessage(null)}
                />
            </IonContent>
        </IonPage>
    );
};

export default EmpresasForm;