// src/pages/EmpresasForm.tsx

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonItem,
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
    useIonAlert // Importa useIonAlert para confirmaciones
} from "@ionic/react";
import { create, save, close, trash } from "ionicons/icons";
import { useEmpresas } from "../EmpresasContext";
import { useTheme } from "../theme/ThemeContext"; // ¡Importamos el hook del tema!
import { Empresa } from "../types";

const EmpresasForm: React.FC = () => {
    const { empresas, fetchEmpresas, updateEmpresa, createEmpresa, deleteEmpresa } = useEmpresas();
    // Eliminamos 'toggleTheme' de la desestructuración, ya que el tema es automático
    const { theme } = useTheme(); 

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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [presentAlert] = useIonAlert();

    const cargarEmpresas = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchEmpresas();
        } catch (error) {
            console.error("Error al cargar empresas:", error);
            setErrorMessage("Error al cargar empresas. Intente nuevamente.");
        } finally {
            setIsLoading(false);
        }
    }, [fetchEmpresas]);

    useEffect(() => {
        cargarEmpresas();
    }, [cargarEmpresas]);

    const handleInputChange = (key: keyof Omit<Empresa, "id">, value: string | null | undefined) => {
        setFormData((prevData) => ({ ...prevData, [key]: value || "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createEmpresa(formData);
            setFormData({
                nombre: "",
                direccion: "",
                categoria: "",
                whatsapp: "",
                instagram: "",
            });
            await cargarEmpresas();
            setSuccessMessage("Empresa creada exitosamente.");
        } catch (error) {
            console.error("Error al crear empresa:", error);
            setErrorMessage("Error al crear empresa. Intente nuevamente.");
        } finally {
            setIsLoading(false);
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
                await updateEmpresa(editandoId, empresaEditando);
                await cargarEmpresas();
                cancelarEdicion();
                setSuccessMessage("Empresa actualizada exitosamente.");
            } catch (error) {
                console.error("Error al actualizar empresa:", error);
                setErrorMessage("Error al actualizar empresa. Intente nuevamente.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        presentAlert({
            header: 'Confirmar Eliminación',
            message: '¿Estás seguro de que quieres eliminar esta empresa?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                },
                {
                    text: 'Eliminar',
                    handler: async () => {
                        setIsLoading(true);
                        try {
                            await deleteEmpresa(id);
                            await cargarEmpresas();
                            setSuccessMessage("Empresa eliminada exitosamente.");
                        } catch (error) {
                            console.error("Error al eliminar empresa:", error);
                            setErrorMessage("Error al eliminar empresa. Intente nuevamente.");
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ],
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Gestión de Empresas</IonTitle>
                    {/* El botón de tema ha sido eliminado de aquí, ya que el tema es automático */}
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Formulario de Creación */}
                <IonCard>
                    <IonCardHeader>
                        <h2>Crear Nueva Empresa</h2>
                    </IonCardHeader>
                    <IonCardContent>
                        <form onSubmit={handleSubmit}>
                            <IonItem>
                                <IonInput
                                    label="Nombre"
                                    labelPlacement="floating"
                                    value={formData.nombre}
                                    onIonChange={(e) => handleInputChange("nombre", e.detail.value)}
                                    maxlength={50}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    label="Dirección"
                                    labelPlacement="floating"
                                    value={formData.direccion}
                                    onIonChange={(e) => handleInputChange("direccion", e.detail.value)}
                                    maxlength={100}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    label="Categoría"
                                    labelPlacement="floating"
                                    value={formData.categoria}
                                    onIonChange={(e) => handleInputChange("categoria", e.detail.value)}
                                    maxlength={50}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    label="WhatsApp"
                                    labelPlacement="floating"
                                    type="tel"
                                    value={formData.whatsapp}
                                    onIonChange={(e) => handleInputChange("whatsapp", e.detail.value)}
                                    maxlength={15}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    label="Instagram"
                                    labelPlacement="floating"
                                    value={formData.instagram}
                                    onIonChange={(e) => handleInputChange("instagram", e.detail.value)}
                                    maxlength={50}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonButton type="submit" expand="block" color="primary" className="ion-margin-top">
                                <IonIcon slot="start" icon={create} />
                                Crear Empresa
                            </IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>

                {/* Lista de Empresas */}
                <IonGrid className="ion-padding-top">
                    <IonRow>
                        {empresas.length === 0 && !isLoading && (
                            <IonCol size="12" className="ion-text-center">
                                <p>No hay empresas registradas. ¡Crea una!</p>
                            </IonCol>
                        )}
                        {empresas.map((empresa: Empresa) => (
                            <IonCol size="12" sizeMd="6" key={empresa.id}>
                                <IonCard>
                                    {editandoId === empresa.id ? (
                                        <IonCardContent>
                                            <h3>Editando {empresa.nombre}</h3>
                                            <IonItem>
                                                <IonInput
                                                    label="Nombre"
                                                    labelPlacement="floating"
                                                    value={empresaEditando?.nombre || ''}
                                                    onIonChange={(e) => handleEditInputChange("nombre", e.detail.value)}
                                                    maxlength={50}
                                                    required
                                                ></IonInput>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput
                                                    label="Dirección"
                                                    labelPlacement="floating"
                                                    value={empresaEditando?.direccion || ''}
                                                    onIonChange={(e) => handleEditInputChange("direccion", e.detail.value)}
                                                    maxlength={100}
                                                    required
                                                ></IonInput>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput
                                                    label="Categoría"
                                                    labelPlacement="floating"
                                                    value={empresaEditando?.categoria || ''}
                                                    onIonChange={(e) => handleEditInputChange("categoria", e.detail.value)}
                                                    maxlength={50}
                                                    required
                                                ></IonInput>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput
                                                    label="WhatsApp"
                                                    labelPlacement="floating"
                                                    type="tel"
                                                    value={empresaEditando?.whatsapp || ''}
                                                    onIonChange={(e) => handleEditInputChange("whatsapp", e.detail.value)}
                                                    maxlength={15}
                                                    required
                                                ></IonInput>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput
                                                    label="Instagram"
                                                    labelPlacement="floating"
                                                    value={empresaEditando?.instagram || ''}
                                                    onIonChange={(e) => handleEditInputChange("instagram", e.detail.value)}
                                                    maxlength={50}
                                                    required
                                                ></IonInput>
                                            </IonItem>
                                            <IonButton onClick={guardarEdicion} expand="block" color="primary" className="ion-margin-top">
                                                <IonIcon slot="start" icon={save} />
                                                Guardar Cambios
                                            </IonButton>
                                            <IonButton onClick={cancelarEdicion} expand="block" color="medium" className="ion-margin-top">
                                                <IonIcon slot="start" icon={close} />
                                                Cancelar
                                            </IonButton>
                                        </IonCardContent>
                                    ) : (
                                        <IonCardContent>
                                            <IonCardHeader className="ion-no-padding">
                                                <h2>{empresa.nombre}</h2>
                                            </IonCardHeader>
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
                                            <IonButton onClick={() => iniciarEdicion(empresa)} expand="block" className="ion-margin-top">
                                                <IonIcon slot="start" icon={create} />
                                                Editar
                                            </IonButton>
                                            <IonButton onClick={() => handleDelete(empresa.id)} expand="block" color="danger" className="ion-margin-top">
                                                <IonIcon slot="start" icon={trash} />
                                                Eliminar
                                            </IonButton>
                                        </IonCardContent>
                                    )}
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                <IonLoading isOpen={isLoading} message={"Cargando..."} spinner="circles" />
                <IonToast
                    isOpen={!!errorMessage}
                    message={errorMessage || ""}
                    duration={3000}
                    color="danger"
                    onDidDismiss={() => setErrorMessage(null)}
                />
                <IonToast
                    isOpen={!!successMessage}
                    message={successMessage || ""}
                    duration={3000}
                    color="success"
                    onDidDismiss={() => setSuccessMessage(null)}
                />
            </IonContent>
        </IonPage>
    );
};

export default EmpresasForm;