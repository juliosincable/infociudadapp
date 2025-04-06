import React, { useState, useEffect } from "react";
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
} from "@ionic/react";
import { create, save, close } from "ionicons/icons";
import { useEmpresas } from "../EmpresasContext";
import { Empresa } from "../types";

const EmpresasForm: React.FC = () => {
    const { empresas, fetchEmpresas, updateEmpresa, createEmpresa } = useEmpresas();

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
    }, []);

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

    const handleInputChange = (key: keyof Omit<Empresa, "id">, value: string) => {
        setFormData({ ...formData, [key]: value });
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
            await fetchEmpresas(); // Actualiza la lista de empresas
        } catch (error) {
            console.error("Error al crear empresa:", error);
            setErrorMessage("Error al crear empresa. Intente nuevamente.");
        }
    };

    const iniciarEdicion = (empresa: Empresa) => {
        setEditandoId(empresa.id);
        setEmpresaEditando({ ...empresa });
    };

    const cancelarEdicion = () => {
        setEditandoId("");
        setEmpresaEditando(null);
    };

    const handleEditInputChange = (key: keyof Empresa, value: string) => {
        if (empresaEditando) {
            setEmpresaEditando({ ...empresaEditando, [key]: value });
        }
    };

    const guardarEdicion = async () => {
        if (empresaEditando && editandoId) {
            setIsLoading(true);
            try {
                await updateEmpresa(editandoId, empresaEditando);
                await fetchEmpresas(); // Actualiza la lista de empresas
                cancelarEdicion();
            } catch (error) {
                console.error("Error al actualizar empresa:", error);
                setErrorMessage("Error al actualizar empresa. Intente nuevamente.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <IonPage placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <IonHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <IonToolbar placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IonTitle placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Gestión de Empresas</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {/* Formulario de Creación */}
                <form onSubmit={handleSubmit}>
                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Nombre</IonLabel>
                        <IonInput
                value={formData.nombre}
                onIonChange={(e) => handleInputChange("nombre", e.detail.value!)}
                maxlength={20} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        />
                    </IonItem>
                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Dirección</IonLabel>
                        <IonInput
                value={formData.direccion}
                onIonChange={(e) => handleInputChange("direccion", e.detail.value!)}
                maxlength={20} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        />
                    </IonItem>
                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Categoría</IonLabel>
                        <IonInput
                value={formData.categoria}
                onIonChange={(e) => handleInputChange("categoria", e.detail.value!)}
                maxlength={20} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        />
                    </IonItem>
                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>WhatsApp</IonLabel>
                        <IonInput
                value={formData.whatsapp}
                onIonChange={(e) => handleInputChange("whatsapp", e.detail.value!)}
                maxlength={20} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        />
                    </IonItem>
                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Instagram</IonLabel>
                        <IonInput
                value={formData.instagram}
                onIonChange={(e) => handleInputChange("instagram", e.detail.value!)}
                maxlength={20} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        />
                    </IonItem>
                    <IonButton type="submit" expand="block" color="primary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Crear Empresa
                    </IonButton>
                </form>

                {/* Lista de Empresas */}
                <IonGrid placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IonRow placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {empresas.map((empresa) => (
                            <IonCol size="12" sizeMd="6" key={empresa.id} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <IonCard placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <IonCardHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        <h2>{empresa.nombre}</h2>
                                    </IonCardHeader>
                                    <IonCardContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        {editandoId === empresa.id ? (
                                            <>
                                                <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Nombre</IonLabel>
                                                    <IonInput
                                        value={empresaEditando?.nombre}
                                        onIonChange={(e) => handleEditInputChange("nombre", e.detail.value!)}
                                        maxlength={20} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    />
                                                </IonItem>
                                                <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Dirección</IonLabel>
                                                    <IonInput
                                        value={empresaEditando?.direccion}
                                        onIonChange={(e) => handleEditInputChange("direccion", e.detail.value!)}
                                        maxlength={20} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    />
                                                </IonItem>
                                                <IonButton onClick={guardarEdicion} expand="block" color="primary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <IonIcon slot="start" icon={save} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                    Guardar
                                                </IonButton>
                                                <IonButton onClick={cancelarEdicion} expand="block" color="medium" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <IonIcon slot="start" icon={close} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
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
                                                <IonButton onClick={() => iniciarEdicion(empresa)} expand="block" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <IonIcon slot="start" icon={create} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                    Editar
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