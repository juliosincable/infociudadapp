import * as React from "react";
import { useState, useEffect, useCallback } from "react";
// Si estás usando `useParams` para obtener el ID de la URL, descoméntalo:
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
    useIonAlert,
    IonLabel,
    IonTextarea,
    InputChangeEventDetail, // Para el tipado de onIonChange
} from "@ionic/react";
import { create, save, close, trash } from "ionicons/icons";
import { useEmpresas } from "../EmpresasContext";
import { useTheme } from "../theme/ThemeContext";
import { Empresa } from "../types";

const EmpresasForm: React.FC = () => {
    // Si usas useParams, descomenta la siguiente línea y ajusta el tipo si es necesario
    // const { id } = useParams<{ id?: string }>(); // Captura el ID de la URL para edición

    const { empresas, fetchEmpresas, updateEmpresa, createEmpresa, deleteEmpresa, isLoading: contextLoading, error: contextError } = useEmpresas();
    const { theme } = useTheme();

    // MODIFICADO: initialFormData DEBE INCLUIR TODOS LOS CAMPOS DE Empresa
    // e inicializar ubicacionGps como un objeto
    const initialFormData: Omit<Empresa, "id"> = {
        nombre: "",
        direccion: "",
        categoria: "",
        whatsapp: "",
        instagram: "",
        descripcion: "",
        telefono: "",
        email: "",
        logoUrl: "",
        horarioAtencion: "",
        sitioWeb: "",
        servicios: [], // Array vacío
        ubicacionGps: { lat: 0, lng: 0 }, // Inicializar con valores numéricos por defecto
        tiktok: "",
    };

    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa | Omit<Empresa, "id">>(initialFormData);
    const [isEditing, setIsEditing] = useState(false);
    
    // Estados para mensajes de feedback
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [presentAlert] = useIonAlert();

    // Este useEffect es para cargar los datos si estás en modo edición (por URL)
    // Si tu formulario está en una página sin ID en la URL para crear, y la edición se hace desde una lista que le pasa el objeto,
    // este useEffect puede ser reemplazado por la función `iniciarEdicionDesdeLista` o similar.
    // He asumido que puedes pasar un ID por URL para la edición.
    useEffect(() => {
        // Simulación de carga de empresa para edición si `id` existe
        // Si el `id` viene de `useParams()`, descomenta la línea de `useParams` arriba.
        // if (id) {
        //     const empresaToEdit = empresas.find(emp => emp.id === id);
        //     if (empresaToEdit) {
        //         setCurrentEmpresa(empresaToEdit);
        //         setIsEditing(true);
        //     } else {
        //         setErrorMessage("Empresa no encontrada para edición.");
        //         // Opcional: history.push('/admin/empresas'); para redirigir si no se encuentra
        //     }
        // } else {
            setCurrentEmpresa(initialFormData);
            setIsEditing(false);
        // }
    }, [/* id, */ empresas]); // Añade `id` si lo usas con useParams

    // MODIFICADO: handleInputChange debe manejar todos los tipos de campos
    const handleInputChange = (key: keyof Empresa, value: string | string[] | { lat: number; lng: number; } | null | undefined) => {
        setCurrentEmpresa((prevData) => {
            // Manejo especial para 'servicios' que es un array de strings
            if (key === 'servicios') {
                const serviciosArray = typeof value === 'string' ? value.split(',').map(s => s.trim()).filter(s => s !== '') : [];
                return { ...prevData, [key]: serviciosArray };
            }
            // Manejo especial para 'ubicacionGps'
            if (key === 'ubicacionGps') {
                return { ...prevData, [key]: value as { lat: number; lng: number; } };
            }
            // Para todos los demás campos (string o opcionales)
            return { ...prevData, [key]: value || "" }; // Asegura que los campos opcionales sean "" si son null/undefined
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log("Datos del formulario a enviar:", currentEmpresa); // Depuración

        // Pequeña validación antes de enviar
        if (!currentEmpresa.nombre || !currentEmpresa.direccion || !currentEmpresa.categoria || !currentEmpresa.whatsapp || !currentEmpresa.instagram || !currentEmpresa.descripcion) {
            setErrorMessage("Por favor, rellena todos los campos obligatorios.");
            return;
        }

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
            // Opcional: recargar la lista de empresas si no se actualiza automáticamente
            // fetchEmpresas(); 
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} empresa:`, error);
            setErrorMessage(`Error al ${isEditing ? 'actualizar' : 'crear'} empresa. Intente nuevamente.`);
        }
    };

    // Nueva función para manejar el clic en "Editar" desde la lista (si el formulario está en la misma página)
    // Si usas un router para navegar con ID, esta función no es estrictamente necesaria aquí.
    const iniciarEdicionDesdeLista = (empresa: Empresa) => {
        setCurrentEmpresa(empresa); // Carga los datos de la empresa seleccionada
        setIsEditing(true);         // Activa el modo edición
    };

    const cancelarEdicion = () => {
        setCurrentEmpresa(initialFormData); // Reinicia el formulario
        setIsEditing(false);                // Sale del modo edición
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
                        try {
                            await deleteEmpresa(idToDelete);
                            setSuccessMessage("Empresa eliminada exitosamente.");
                            if (isEditing && 'id' in currentEmpresa && currentEmpresa.id === idToDelete) {
                                setCurrentEmpresa(initialFormData);
                                setIsEditing(false);
                            }
                        } catch (error) {
                            console.error("Error al eliminar empresa:", error);
                            setErrorMessage("Error al eliminar empresa. Intente nuevamente.");
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
                <IonCard id="top-form-card">
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

                            {/* CAMPOS ADICIONALES PARA FORMULARIO */}
                            <IonItem>
                                <IonLabel position="floating">Descripción</IonLabel>
                                <IonTextarea
                                    value={currentEmpresa.descripcion}
                                    onIonChange={(e) => handleInputChange("descripcion", e.detail.value)}
                                    autoGrow={true}
                                    rows={3} // Número de filas iniciales
                                    required
                                ></IonTextarea>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="Teléfono (Opcional)"
                                    labelPlacement="floating"
                                    type="tel"
                                    value={currentEmpresa.telefono || ''}
                                    onIonChange={(e) => handleInputChange("telefono", e.detail.value)}
                                    maxlength={15}
                                ></IonInput>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="Email (Opcional)"
                                    labelPlacement="floating"
                                    type="email"
                                    value={currentEmpresa.email || ''}
                                    onIonChange={(e) => handleInputChange("email", e.detail.value)}
                                    maxlength={100}
                                ></IonInput>
                            </IonItem>
                            
                            <IonItem>
                                <IonInput
                                    label="URL del Logo (Opcional)"
                                    labelPlacement="floating"
                                    type="url" // Asegura que sea un URL válido
                                    value={currentEmpresa.logoUrl || ''}
                                    onIonChange={(e) => handleInputChange("logoUrl", e.detail.value)}
                                    maxlength={255}
                                ></IonInput>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="Horario de Atención (Opcional)"
                                    labelPlacement="floating"
                                    value={currentEmpresa.horarioAtencion || ''}
                                    onIonChange={(e) => handleInputChange("horarioAtencion", e.detail.value)}
                                    maxlength={100}
                                ></IonInput>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="Sitio Web (Opcional)"
                                    labelPlacement="floating"
                                    type="url" // Asegura que sea un URL válido
                                    value={currentEmpresa.sitioWeb || ''}
                                    onIonChange={(e) => handleInputChange("sitioWeb", e.detail.value)}
                                    maxlength={255}
                                ></IonInput>
                            </IonItem>

                            {/* Campo para 'servicios' - se espera un string separado por comas */}
                            <IonItem>
                                <IonLabel position="floating">Servicios (separados por comas, Opcional)</IonLabel>
                                <IonTextarea
                                    value={(currentEmpresa.servicios || []).join(', ')}
                                    onIonChange={(e) => handleInputChange("servicios", e.detail.value)}
                                    autoGrow={true}
                                    rows={2}
                                ></IonTextarea>
                            </IonItem>

                            {/* CAMPOS DE UBICACIÓN GPS - DESCOMENTADOS Y HABILITADOS */}
                            <IonItem>
                                <IonInput
                                    label="Latitud GPS (Opcional)"
                                    labelPlacement="floating"
                                    type="number" // Tipo number para valores numéricos
                                    value={currentEmpresa.ubicacionGps?.lat !== undefined ? currentEmpresa.ubicacionGps.lat : ''}
                                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => {
                                        const value = e.detail.value;
                                        handleInputChange("ubicacionGps", { 
                                            lat: value ? parseFloat(value) : 0, // Asigna 0 si es vacío para mantener coherencia
                                            lng: currentEmpresa.ubicacionGps?.lng || 0 // Mantiene el valor existente de lng
                                        });
                                    }}
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    label="Longitud GPS (Opcional)"
                                    labelPlacement="floating"
                                    type="number" // Tipo number para valores numéricos
                                    value={currentEmpresa.ubicacionGps?.lng !== undefined ? currentEmpresa.ubicacionGps.lng : ''}
                                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => {
                                        const value = e.detail.value;
                                        handleInputChange("ubicacionGps", { 
                                            lat: currentEmpresa.ubicacionGps?.lat || 0, // Mantiene el valor existente de lat
                                            lng: value ? parseFloat(value) : 0 // Asigna 0 si es vacío para mantener coherencia
                                        });
                                    }}
                                ></IonInput>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="TikTok (Opcional)"
                                    labelPlacement="floating"
                                    value={currentEmpresa.tiktok || ''}
                                    onIonChange={(e) => handleInputChange("tiktok", e.detail.value)}
                                    maxlength={50}
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

                {/* Esta es la lista de empresas visible en el mismo formulario.
                    Si ya tienes una página dedicada para la lista (EmpresasList),
                    puedes considerar eliminar o simplificar esta sección para evitar duplicidad.
                    La he dejado completa para que puedas ver todos los datos aquí también. */}
                <h3 className="ion-padding-top">Empresas Existentes</h3>
                <IonGrid className="ion-padding-top">
                    <IonRow>
                        {empresas.length === 0 && !contextLoading && (
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
                                        
                                        {/* MOSTRAR TODOS LOS CAMPOS EN LA LISTA DENTRO DEL FORMULARIO */}
                                        {empresa.descripcion && <p><strong>Descripción:</strong> {empresa.descripcion}</p>}
                                        {empresa.telefono && <p><strong>Teléfono:</strong> {empresa.telefono}</p>}
                                        {empresa.email && <p><strong>Email:</strong> {empresa.email}</p>}
                                        {empresa.logoUrl && <p><strong>URL Logo:</strong> <a href={empresa.logoUrl} target="_blank" rel="noopener noreferrer">{empresa.logoUrl}</a></p>}
                                        {empresa.horarioAtencion && <p><strong>Horario:</strong> {empresa.horarioAtencion}</p>}
                                        {empresa.sitioWeb && <p><strong>Sitio Web:</strong> <a href={empresa.sitioWeb} target="_blank" rel="noopener noreferrer">{empresa.sitioWeb}</a></p>}
                                        {empresa.servicios && empresa.servicios.length > 0 && <p><strong>Servicios:</strong> {empresa.servicios.join(', ')}</p>}
                                        {empresa.ubicacionGps && (empresa.ubicacionGps.lat !== 0 || empresa.ubicacionGps.lng !== 0) && <p><strong>Ubicación GPS:</strong> Lat: {empresa.ubicacionGps.lat}, Lng: {empresa.ubicacionGps.lng}</p>}
                                        {empresa.tiktok && <p><strong>TikTok:</strong> @{empresa.tiktok}</p>}
                                        
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

                <IonLoading isOpen={contextLoading} message={"Cargando..."} spinner="circles" />
                <IonToast
                    isOpen={!!errorMessage || !!contextError}
                    message={errorMessage || contextError || ""}
                    duration={3000}
                    color="danger"
                    onDidDismiss={() => { setErrorMessage(null); /* Puedes resetear contextError aquí también si lo deseas */ }}
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