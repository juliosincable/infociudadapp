// frontend/src/pages/EmpresasForm.tsx

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
    IonList,
    IonTextarea,
    // Eliminamos IonFab, IonFabButton, IonSelect, IonSelectOption
    IonIcon, // IonIcon sí se usa (en los botones de guardar, eliminar, etc.)
    IonLoading,
    IonToast,
    InputChangeEventDetail
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

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
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
            } else {
                setToastMessage("Empresa no encontrada.");
                setShowToast(true);
                history.replace("/empresasList");
            }
        } else {
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
    }, [id, empresas, history]); 

    useEffect(() => {
        if (isLoading) {
            setShowLoading(true);
        } else {
            setShowLoading(false);
        }
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
                setToastMessage("Empresa actualizada con éxito.");
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
                setToastMessage("Empresa agregada con éxito.");
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
            setShowToast(true);
            history.goBack(); 
        } catch (e) {
            console.error("Error en handleSave:", e);
        }
    };

    const handleDelete = async () => {
        if (id) {
            try {
                await deleteEmpresa(id);
                setToastMessage("Empresa eliminada con éxito.");
                setShowToast(true);
                history.goBack(); 
            } catch (e) {
                console.error("Error en handleDelete:", e);
            }
        }
    };

    const handleServiceChange = (e: CustomEvent<InputChangeEventDetail>) => {
        const value = String(e.detail.value || '');
        setServicios(value.split(',').map(s => s.trim()).filter(s => s.length > 0));
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" onClick={() => history.goBack()}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                    <IonTitle>{isEditMode ? "Editar Empresa" : "Nueva Empresa"}</IonTitle>
                    {isEditMode && (
                        <IonButton slot="end" color="danger" onClick={handleDelete}>
                            <IonIcon icon={trash} />
                        </IonButton>
                    )}
                    <IonButton slot="end" onClick={handleSave}>
                        <IonIcon icon={save} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel position="floating">Nombre de la Empresa <span style={{color: 'red'}}>*</span></IonLabel>
                        <IonInput
                            value={nombre}
                            onIonChange={(e) => setNombre(String(e.detail.value || ''))}
                            required
                            maxlength={100}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Dirección</IonLabel>
                        <IonInput
                            value={direccion}
                            onIonChange={(e) => setDireccion(String(e.detail.value || ''))}
                            maxlength={200}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Teléfono</IonLabel>
                        <IonInput
                            value={telefono}
                            onIonChange={(e) => setTelefono(String(e.detail.value || ''))}
                            type="tel"
                            maxlength={20}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput
                            value={email}
                            onIonChange={(e) => setEmail(String(e.detail.value || ''))}
                            type="email"
                            maxlength={100}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">URL Logo</IonLabel>
                        <IonInput
                            value={logoUrl}
                            onIonChange={(e) => setLogoUrl(String(e.detail.value || ''))}
                            type="url"
                            maxlength={255}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Horario de Atención</IonLabel>
                        <IonInput
                            value={horarioAtencion}
                            onIonChange={(e) => setHorarioAtencion(String(e.detail.value || ''))}
                            maxlength={100}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Sitio Web</IonLabel>
                        <IonInput
                            value={sitioWeb}
                            onIonChange={(e) => setSitioWeb(String(e.detail.value || ''))}
                            type="url"
                            maxlength={255}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Categoría</IonLabel>
                        <IonInput
                            value={categoria}
                            onIonChange={(e) => setCategoria(String(e.detail.value || ''))}
                            maxlength={50}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Descripción</IonLabel>
                        <IonTextarea
                            value={descripcion}
                            onIonChange={(e) => setDescripcion(String(e.detail.value || ''))}
                            rows={3}
                            maxlength={500}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">WhatsApp</IonLabel>
                        <IonInput
                            value={whatsapp}
                            onIonChange={(e) => setWhatsapp(String(e.detail.value || ''))}
                            type="tel"
                            maxlength={20}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Instagram (sin @)</IonLabel>
                        <IonInput
                            value={instagram}
                            onIonChange={(e) => setInstagram(String(e.detail.value || ''))}
                            maxlength={50}
                        />
                    </IonItem>
                     <IonItem>
                        <IonLabel position="floating">TikTok (sin @)</IonLabel>
                        <IonInput
                            value={tiktok}
                            onIonChange={(e) => setTiktok(String(e.detail.value || ''))}
                            maxlength={50}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Servicios (separados por coma)</IonLabel>
                        <IonInput
                            value={servicios.join(', ')}
                            onIonChange={handleServiceChange}
                            maxlength={500}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Latitud (GPS)</IonLabel>
                        <IonInput
                            value={latitud}
                            onIonChange={(e) => setLatitud(parseFloat(String(e.detail.value || '0')) || 0)}
                            type="number"
                            step="any"
                        />
                    </IonItem>
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