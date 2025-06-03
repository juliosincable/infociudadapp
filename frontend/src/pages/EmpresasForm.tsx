// src/pages/EmpresasForm.tsx (Asegúrate de que este es el archivo que estás modificando)

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
// IMPORTANTE: Si estás usando react-router-dom para navegar a una ruta /form/:id
// entonces deberías usar useParams. Si el formulario siempre está en la misma página,
// y solo se usa para crear/editar en esa misma página, useParams NO es necesario.
// Para este caso en particular, asumo que el formulario SIEMPRE está en la misma página
// y por lo tanto, no necesitamos useParams. Si tu navegación es diferente, házmelo saber.
// import { useParams } from "react-router-dom"; 

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
    useIonAlert
} from "@ionic/react";
import { create, save, close, trash } from "ionicons/icons";
import { useEmpresas } from "../EmpresasContext";
import { useTheme } from "../theme/ThemeContext";
import { Empresa } from "../types";

const EmpresasForm: React.FC = () => {
    // const { id } = useParams<{ id?: string }>(); // Descomenta si usas el ID de la URL
    const { empresas, fetchEmpresas, updateEmpresa, createEmpresa, deleteEmpresa } = useEmpresas();
    const { theme } = useTheme();

    const initialFormData: Omit<Empresa, "id"> = { // Define el estado inicial para reusar
        nombre: "",
        direccion: "",
        categoria: "",
        whatsapp: "",
        instagram: "",
    };

    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa | Omit<Empresa, "id">>(initialFormData);
    const [isEditing, setIsEditing] = useState(false);
    
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

    // Elimina este useEffect si no estás pasando el ID por URL y el formulario está en la misma página.
    // Si estás usando `useParams`, entonces sí mantenlo.
    /*
    useEffect(() => {
        if (id) {
            const empresaToEdit = empresas.find(emp => emp.id === id);
            if (empresaToEdit) {
                setCurrentEmpresa(empresaToEdit);
                setIsEditing(true);
            } else {
                setErrorMessage("Empresa no encontrada para edición.");
                // Opcional: history.push('/admin/empresas'); para redirigir
            }
        } else {
            setCurrentEmpresa(initialFormData);
            setIsEditing(false);
        }
    }, [id, empresas]);
    */

    const handleInputChange = (key: keyof Omit<Empresa, "id">, value: string | null | undefined) => {
        setCurrentEmpresa((prevData) => ({ ...prevData, [key]: value || "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditing && 'id' in currentEmpresa && currentEmpresa.id) {
                await updateEmpresa(currentEmpresa.id, currentEmpresa as Empresa);
                setSuccessMessage("Empresa actualizada exitosamente.");
            } else {
                await createEmpresa(currentEmpresa as Omit<Empresa, "id">);
                setSuccessMessage("Empresa creada exitosamente.");
            }
            
            // Reiniciar el formulario después de la operación exitosa
            setCurrentEmpresa(initialFormData); // Usa el estado inicial para reiniciar
            setIsEditing(false); // Volver a modo creación
            // Ya no es necesario cargarEmpresas aquí porque el contexto ya actualiza el estado local
            // y si quieres forzar un refetch de la API, ya lo hace el useEffect inicial al montar
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} empresa:`, error);
            setErrorMessage(`Error al ${isEditing ? 'actualizar' : 'crear'} empresa. Intente nuevamente.`);
        } finally {
            setIsLoading(false);
        }
    };

    // Nueva función para manejar el clic en "Editar" desde la lista
    const iniciarEdicionDesdeLista = (empresa: Empresa) => {
        setCurrentEmpresa(empresa); // Carga los datos de la empresa seleccionada
        setIsEditing(true);         // Activa el modo edición
        // Opcional: Desplazar la vista hacia el formulario de edición si está muy abajo
        // document.getElementById('top-form-card')?.scrollIntoView({ behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setCurrentEmpresa(initialFormData); // Reinicia el formulario
        setIsEditing(false);               // Sale del modo edición
    };

    const handleDelete = async (idToDelete: string) => {
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
                            await deleteEmpresa(idToDelete);
                            // La lista se actualizará automáticamente gracias al contexto
                            setSuccessMessage("Empresa eliminada exitosamente.");
                            // Si se eliminó la empresa que se estaba editando, resetear el formulario
                            if (isEditing && 'id' in currentEmpresa && currentEmpresa.id === idToDelete) {
                                setCurrentEmpresa(initialFormData);
                                setIsEditing(false);
                            }
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
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Formulario de Creación/Edición */}
                <IonCard id="top-form-card"> {/* Agregamos un ID si quieres hacer scroll */}
                    <IonCardHeader>
                        <h2>{isEditing ? "Editar Empresa" : "Crear Nueva Empresa"}</h2>
                    </IonCardHeader>
                    <IonCardContent>
                        <form onSubmit={handleSubmit}>
                            <IonItem>
                                <IonInput
                                    label="Nombre"
                                    labelPlacement="floating"
                                    value={currentEmpresa.nombre}
                                    onIonChange={(e) => handleInputChange("nombre", e.detail.value)}
                                    maxlength={50}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    label="Dirección"
                                    labelPlacement="floating"
                                    value={currentEmpresa.direccion}
                                    onIonChange={(e) => handleInputChange("direccion", e.detail.value)}
                                    maxlength={100}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    label="Categoría"
                                    labelPlacement="floating"
                                    value={currentEmpresa.categoria}
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
                                    value={currentEmpresa.whatsapp}
                                    onIonChange={(e) => handleInputChange("whatsapp", e.detail.value)}
                                    maxlength={15}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    label="Instagram"
                                    labelPlacement="floating"
                                    value={currentEmpresa.instagram}
                                    onIonChange={(e) => handleInputChange("instagram", e.detail.value)}
                                    maxlength={50}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonButton type="submit" expand="block" color="primary" className="ion-margin-top">
                                <IonIcon slot="start" icon={isEditing ? save : create} />
                                {isEditing ? "Guardar Cambios" : "Crear Empresa"}
                            </IonButton>
                            {isEditing && (
                                <IonButton onClick={cancelarEdicion} expand="block" color="medium" className="ion-margin-top">
                                    <IonIcon slot="start" icon={close} />
                                    Cancelar Edición
                                </IonButton>
                            )}
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
                                    <IonCardContent>
                                        <h3><strong>Nombre:</strong> {empresa.nombre}</h3>
                                        <p><strong>Dirección:</strong> {empresa.direccion}</p>
                                        <p><strong>Categoría:</strong> {empresa.categoria}</p>
                                        <p><strong>WhatsApp:</strong> {empresa.whatsapp}</p>
                                        <p><strong>Instagram:</strong> {empresa.instagram}</p>
                                        
                                        {/* EL BOTÓN DE EDITAR AHORA LLAMA A LA FUNCIÓN CORRECTA */}
                                        <IonButton 
                                            onClick={() => iniciarEdicionDesdeLista(empresa)} 
                                            expand="block" 
                                            className="ion-margin-top"
                                        >
                                            <IonIcon slot="start" icon={create} />
                                            Editar
                                        </IonButton>
                                        
                                        <IonButton 
                                            onClick={() => handleDelete(empresa.id)} 
                                            expand="block" 
                                            color="danger" 
                                            className="ion-margin-top"
                                        >
                                            <IonIcon slot="start" icon={trash} />
                                            Eliminar
                                        </IonButton>
                                    </IonCardContent>
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