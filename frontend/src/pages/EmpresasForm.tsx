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
    IonLabel,
    IonButtons // Importación esencial para agrupar botones
} from "@ionic/react";
import { save, arrowBack, trash } from "ionicons/icons";
import { useParams, useHistory } from "react-router-dom";
import { useEmpresas } from "../EmpresasContext";
import { Empresa } from "../types";

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

    // useEffect principal para cargar y/o inicializar el formulario
    useEffect(() => {
        if (id) { // Estamos en modo edición
            setIsEditMode(true);
            if (empresas.length === 0 && !isLoading) {
                fetchEmpresas();
            } else {
                const empresaToEdit = empresas.find((emp) => emp.id === id);
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
                } else if (!isLoading) {
                    setToastMessage("Empresa no encontrada.");
                    setShowToast(true);
                    history.replace("/empresasList");
                }
            }
        } else { // Estamos en modo de creación
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
    }, [id, empresas, history, fetchEmpresas, isLoading]);

    // Efectos para manejar estados de carga y errores
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

                    {/* Eliminamos los botones de Guardar/Actualizar y Eliminar de aquí */}
                    {/* <IonButtons slot="end"> ... </IonButtons> */}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
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
                        <IonLabel position="floating">Servicios (separados por coma)</IonLabel>
                        <IonInput
                            value={servicios.join(', ')}
                            onIonChange={handleServiceChange}
                            maxlength={500}
                        />
                    </IonItem>
                    {/* Campo: Latitud (GPS) */}
                    <IonItem>
                        <IonLabel position="floating">Latitud (GPS)</IonLabel>
                        <IonInput
                            value={latitud}
                            onIonChange={(e) => setLatitud(parseFloat(String(e.detail.value || '0')) || 0)}
                            type="number"
                            step="any"
                        />
                    </IonItem>
                    {/* Campo: Longitud (GPS) */}
                    <IonItem>
                        <IonLabel position="floating">Longitud (GPS)</IonLabel>
                        <IonInput
                            value={longitud}
                            onIonChange={(e) => setLongitud(parseFloat(String(e.detail.value || '0')) || 0)}
                            type="number"
                            step="any"
                        />
                    </IonItem>
                </IonList>

                {/* Contenedor para los botones de Guardar/Actualizar y Eliminar */}
                <div className="ion-padding ion-margin-top ion-text-center">
                    <IonButtons style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {/* Botón de Eliminar: Solo visible en modo edición */}
                        {isEditMode && (
                            <IonButton expand="block" color="danger" onClick={handleDelete}>
                                <IonIcon slot="start" icon={trash} />
                                Eliminar
                            </IonButton>
                        )}
                        {/* Botón de Guardar/Actualizar: Texto dinámico */}
                        <IonButton expand="block" color="primary" onClick={handleSave}>
                            <IonIcon slot="start" icon={save} />
                            {isEditMode ? "Actualizar" : "Guardar"}
                        </IonButton>
                    </IonButtons>
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
