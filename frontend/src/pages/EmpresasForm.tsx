import React, { useState, useEffect } from "react";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonItem,
    IonButton,
    IonList,
    IonTextarea,
    IonIcon,
    IonLoading,
    IonToast,
    InputChangeEventDetail,
    // 💡 REMOVIDO: IonLabel ya no es necesario para estos campos
    IonButtons, // Importación esencial para agrupar botones
    IonGrid, // Importamos el componente Grid
    IonRow, // Importamos el componente Row
    IonCol, // Importamos el componente Col
    // 💡 IMPORTAMOS EL HOOK DE CICLO DE VIDA DE IONIC REACT
    useIonViewWillEnter 
} from "@ionic/react";
import { save, arrowBack, trash } from "ionicons/icons";
import { useParams, useHistory } from "react-router-dom";
import { useEmpresas } from "../context/EmpresasContext";
import { Empresa } from "../types/types";

const EmpresasForm: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const history = useHistory();
    const {
        empresas,
        fetchEmpresas,
        createEmpresa,
        updateEmpresa,
        deleteEmpresa,
        isLoading,
        error,
        clearError,
    } = useEmpresas();

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [horarioAtencion, setHorarioAtencion] = useState("");
    const [sitioWeb, setSitioWeb] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [instagram, setInstagram] = useState("");
    const [tiktok, setTiktok] = useState("");
    const [servicios, setServicios] = useState<string[]>([]);
    const [latitud, setLatitud] = useState<number>(0);
    const [longitud, setLongitud] = useState<number>(0);
    const [showLoading, setShowLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    // --- LÓGICA DE INICIALIZACIÓN/CARGA CENTRALIZADA ---

    // Función que carga o limpia el formulario. Se ejecutará cuando:
    // 1. La vista va a entrar (useIonViewWillEnter).
    // 2. La lista de empresas se carga (useEffect de dependencia).
    const initializeForm = (currentEmpresas: Empresa[]) => {
        console.log(`[EmpresasForm] Inicializando formulario para ID: ${id || 'Nuevo'}`);
        
        if (id) { // Modo edición
            setIsEditMode(true);
            
            // Si las empresas aún no están cargadas, las solicitamos (esto disparará el useEffect)
            if (currentEmpresas.length === 0 && !isLoading) {
                // No llamamos a fetchEmpresas aquí directamente, ya que el estado del Context 
                // (empresas) es una dependencia en el useEffect de abajo que manejará la carga.
                // Solo aseguramos que la lista se está intentando obtener.
                return;
            }

            // Buscamos la empresa en la lista
            const empresaToEdit = currentEmpresas.find((emp) => emp.id === id);

            if (empresaToEdit) {
                setNombre(empresaToEdit.nombre);
                setDireccion(empresaToEdit.direccion || "");
                setTelefono(empresaToEdit.telefono || "");
                setEmail(empresaToEdit.email || "");
                setLogoUrl(empresaToEdit.logoUrl || "");
                setHorarioAtencion(empresaToEdit.horarioAtencion || "");
                setSitioWeb(empresaToEdit.sitioWeb || "");
                setCategoria(empresaToEdit.categoria || "");
                setDescripcion(empresaToEdit.descripcion || "");
                setWhatsapp(empresaToEdit.whatsapp || "");
                setInstagram(empresaToEdit.instagram || "");
                setTiktok(empresaToEdit.tiktok || "");
                setServicios(empresaToEdit.servicios || []);
                setLatitud(empresaToEdit.ubicacionGps?.lat || 0);
                setLongitud(empresaToEdit.ubicacionGps?.lng || 0);
            } else if (currentEmpresas.length > 0 && !isLoading) {
                // Si ya tenemos la lista de empresas y la que buscamos no está
                setToastMessage("Empresa no encontrada.");
                setShowToast(true);
                history.replace("/empresasList");
            }
        } else { // Modo creación (limpiar campos)
            setIsEditMode(false);
            setNombre("");
            setDireccion("");
            setTelefono("");
            setEmail("");
            setLogoUrl("");
            setHorarioAtencion("");
            setSitioWeb("");
            setCategoria("");
            setDescripcion("");
            setWhatsapp("");
            setInstagram("");
            setTiktok("");
            setServicios([]);
            setLatitud(0);
            setLongitud(0);
        }
    };
    
    // 🔑 HOOK DE CICLO DE VIDA DE IONIC:
    // Ejecuta la lógica de inicialización y asegura que el estado de 'empresas' se actualice
    // si es necesario cuando la vista entra (útil para el modo Edición).
    useIonViewWillEnter(() => {
        // En modo Edición, si la lista de empresas no está cargada, la solicitamos.
        // Esto es necesario porque el `useEffect` no se volverá a disparar a menos que 'id' cambie.
        if (id && empresas.length === 0 && !isLoading) {
            fetchEmpresas();
        } else {
            // Si la lista ya está cargada o estamos en modo Creación, inicializamos.
            initializeForm(empresas);
        }
    });

    // 💡 useEffect para manejar la carga asíncrona de empresas:
    // Si la página entra en modo Edición, llama a initializeForm tan pronto como la lista 
    // de 'empresas' se actualice.
    useEffect(() => {
        if (id && empresas.length > 0) {
            initializeForm(empresas);
        }
        // Nota: El useEffect anterior ha sido reemplazado por la combinación de 
        // useIonViewWillEnter y este useEffect de dependencia.
    }, [empresas, id]); // Dependencias: lista de empresas y el ID de la ruta

    // Efectos para manejar estados de carga y errores (se mantienen igual)
    useEffect(() => {
        setShowLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
        if (error) {
            setToastMessage(error);
            setShowToast(true);
            clearError();
        }
    }, [error, clearError]);

    const handleSave = async () => {
        if (!nombre) {
            setToastMessage("El nombre de la empresa es obligatorio.");
            setShowToast(true);
            return;
        }

        try {
            let successMessage = "";
            if (isEditMode) {
                const empresaToUpdate: Empresa = {
                    id: id!,
                    nombre,
                    direccion: direccion || "",
                    telefono: telefono || "",
                    email: email || "",
                    logoUrl: logoUrl || "",
                    horarioAtencion: horarioAtencion || "",
                    sitioWeb: sitioWeb || "",
                    categoria: categoria || "",
                    descripcion: descripcion || "",
                    whatsapp: whatsapp || "",
                    instagram: instagram || "",
                    tiktok: tiktok || "",
                    servicios: servicios.length > 0 ? servicios : [],
                    ubicacionGps: (latitud !== 0 || longitud !== 0) ? { lat: latitud, lng: longitud } : undefined,
                };
                await updateEmpresa(id!, empresaToUpdate);
                successMessage = "Empresa actualizada con éxito.";
            } else {
                const newEmpresaData = {
                    nombre,
                    direccion: direccion || undefined,
                    telefono: telefono || undefined,
                    email: email || undefined,
                    logoUrl: logoUrl || undefined,
                    horarioAtencion: horarioAtencion || undefined,
                    sitioWeb: sitioWeb || undefined,
                    categoria: categoria || undefined,
                    descripcion: descripcion || undefined,
                    whatsapp: whatsapp || undefined,
                    instagram: instagram || undefined,
                    tiktok: tiktok || undefined,
                    servicios: servicios.length > 0 ? servicios : undefined,
                    ubicacionGps: (latitud !== 0 || longitud !== 0) ? { lat: latitud, lng: longitud } : undefined,
                };
                await createEmpresa(newEmpresaData);
                successMessage = "Empresa agregada con éxito.";
                // Resetear campos después de agregar una nueva empresa
                setNombre("");
                setDireccion("");
                setTelefono("");
                setEmail("");
                setLogoUrl("");
                setHorarioAtencion("");
                setSitioWeb("");
                setCategoria("");
                setDescripcion("");
                setWhatsapp("");
                setInstagram("");
                setTiktok("");
                setServicios([]);
                setLatitud(0);
                setLongitud(0);
            }

            setToastMessage(successMessage);
            setShowToast(true);

            setTimeout(() => {
                history.goBack();
            }, 3000);

        } catch (e: any) {
            console.error("Error en handleSave:", e);
            setToastMessage(e.message || "Error al guardar empresa.");
            setShowToast(true);
        }
    };

    const handleDelete = async () => {
        if (id) {
            try {
                await deleteEmpresa(id);
                setToastMessage("Empresa eliminada con éxito.");
                setShowToast(true);
                setTimeout(() => {
                    history.goBack();
                }, 3000);
            } catch (e: any) {
                console.error("Error en handleDelete:", e);
                setToastMessage(e.message || "Error al eliminar empresa.");
                setShowToast(true);
            }
        }
    };

    const handleServiceChange = (e: CustomEvent<InputChangeEventDetail>) => {
        const value = (e.detail.value || '').toString();
        setServicios(value.split(',').map(s => s.trim()).filter(s => s.length > 0));
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {/* Botón de Volver al inicio (izquierda) de la barra */}
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.goBack()} color="primary">
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>

                    {/* Título de la página en el centro */}
                    <IonTitle>{isEditMode ? "Editar Empresa" : "Nueva Empresa"}</IonTitle>

                </IonToolbar>
            </IonHeader>
            
            <IonContent fullscreen className="ion-padding">
                {/* 💡 CONTENEDOR PRINCIPAL: Aplica el centrado y margen de variables.scss */}
                <div className="app-container"> 
                    <IonList>
                        {/* Campo: Nombre de la Empresa (Obligatorio) */}
                        <IonItem>
                            <IonInput
                                label="Nombre de la Empresa"
                                labelPlacement="floating"
                                value={nombre}
                                onIonChange={(e) => setNombre(String(e.detail.value || ''))}
                                required
                                maxlength={100}
                            >
                                <span slot="label" style={{color: 'red', marginLeft: '5px'}}>*</span>
                            </IonInput>
                        </IonItem>
                        {/* Campo: Dirección */}
                        <IonItem>
                            <IonInput
                                label="Dirección"
                                labelPlacement="floating"
                                value={direccion}
                                onIonChange={(e) => setDireccion(String(e.detail.value || ''))}
                                maxlength={200}
                            />
                        </IonItem>
                        {/* Campo: Teléfono */}
                        <IonItem>
                            <IonInput
                                label="Teléfono"
                                labelPlacement="floating"
                                value={telefono}
                                onIonChange={(e) => setTelefono(String(e.detail.value || ''))}
                                type="tel"
                                maxlength={20}
                            />
                        </IonItem>
                        {/* Campo: Email */}
                        <IonItem>
                            <IonInput
                                label="Email"
                                labelPlacement="floating"
                                value={email}
                                onIonChange={(e) => setEmail(String(e.detail.value || ''))}
                                type="email"
                                maxlength={100}
                            />
                        </IonItem>
                        {/* Campo: URL Logo */}
                        <IonItem>
                            <IonInput
                                label="URL Logo"
                                labelPlacement="floating"
                                value={logoUrl}
                                onIonChange={(e) => setLogoUrl(String(e.detail.value || ''))}
                                type="url"
                                maxlength={255}
                            />
                        </IonItem>
                        {/* Campo: Horario de Atención */}
                        <IonItem>
                            <IonInput
                                label="Horario de Atención"
                                labelPlacement="floating"
                                value={horarioAtencion}
                                onIonChange={(e) => setHorarioAtencion(String(e.detail.value || ''))}
                                maxlength={100}
                            />
                        </IonItem>
                        {/* Campo: Sitio Web */}
                        <IonItem>
                            <IonInput
                                label="Sitio Web"
                                labelPlacement="floating"
                                value={sitioWeb}
                                onIonChange={(e) => setSitioWeb(String(e.detail.value || ''))}
                                type="url"
                                maxlength={255}
                            />
                        </IonItem>
                        {/* Campo: Categoría */}
                        <IonItem>
                            <IonInput
                                label="Categoría"
                                labelPlacement="floating"
                                value={categoria}
                                onIonChange={(e) => setCategoria(String(e.detail.value || ''))}
                                maxlength={50}
                            />
                        </IonItem>
                        {/* Campo: Descripción */}
                        <IonItem>
                            <IonTextarea
                                label="Descripción"
                                labelPlacement="floating"
                                value={descripcion}
                                onIonChange={(e) => setDescripcion(String(e.detail.value || ''))}
                                rows={3}
                                maxlength={500}
                            />
                        </IonItem>
                        {/* Campo: WhatsApp */}
                        <IonItem>
                            <IonInput
                                label="WhatsApp"
                                labelPlacement="floating"
                                value={whatsapp}
                                onIonChange={(e) => setWhatsapp(String(e.detail.value || ''))}
                                type="tel"
                                maxlength={20}
                            />
                        </IonItem>
                        {/* Campo: Instagram */}
                        <IonItem>
                            <IonInput
                                label="Instagram (sin @)"
                                labelPlacement="floating"
                                value={instagram}
                                onIonChange={(e) => setInstagram(String(e.detail.value || ''))}
                                maxlength={50}
                            />
                        </IonItem>
                        {/* Campo: TikTok */}
                        <IonItem>
                            <IonInput
                                label="TikTok (sin @)"
                                labelPlacement="floating"
                                value={tiktok}
                                onIonChange={(e) => setTiktok(String(e.detail.value || ''))}
                                maxlength={50}
                            />
                        </IonItem>
                        
                        {/* Campo: Servicios */}
                        <IonItem>
                            <IonInput
                                label="Servicios (separados por coma)"
                                labelPlacement="floating"
                                value={servicios.join(', ')}
                                onIonChange={handleServiceChange}
                                maxlength={500}
                            />
                        </IonItem>
                        
                        {/* Campo: Latitud (GPS) */}
                        <IonItem>
                            <IonInput
                                label="Latitud (GPS)"
                                labelPlacement="floating"
                                value={latitud}
                                onIonChange={(e) => setLatitud(parseFloat(String(e.detail.value || '0')) || 0)}
                                type="number"
                                step="any"
                            />
                        </IonItem>
                        
                        {/* Campo: Longitud (GPS) */}
                        <IonItem>
                            <IonInput
                                label="Longitud (GPS)"
                                labelPlacement="floating"
                                value={longitud}
                                onIonChange={(e) => setLongitud(parseFloat(String(e.detail.value || '0')) || 0)}
                                type="number"
                                step="any"
                            />
                        </IonItem>
                    </IonList>

                    {/* Contenedor para los botones de Guardar/Actualizar y Eliminar */}
                    <IonGrid className="ion-padding ion-margin-top">
                        {/* Botón de Eliminar: En su propia fila para que ocupe todo el ancho disponible y se apile. */}
                        {isEditMode && (
                            <IonRow>
                                <IonCol>
                                    <IonButton expand="full" color="danger" onClick={handleDelete} className="ion-margin-bottom">
                                        <IonIcon slot="start" icon={trash} />
                                        Eliminar
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        )}
                        {/* Botón de Guardar/Actualizar: En su propia fila para que ocupe todo el ancho disponible. */}
                        <IonRow>
                            <IonCol>
                                <IonButton expand="full" color="primary" onClick={handleSave}>
                                    <IonIcon slot="start" icon={save} />
                                    {isEditMode ? "Actualizar" : "Guardar"}
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                

                <IonLoading isOpen={showLoading} message={isEditMode ? "Guardando cambios..." : "Agregando empresa..."} />
                <IonToast
                    isOpen={showToast}
                    message={toastMessage}
                    duration={3000}
                    onDidDismiss={() => setShowToast(false)}
                    color={error ? "danger" : "success"}
                />
            </IonContent>
        </IonPage>
    );
};


export default EmpresasForm;