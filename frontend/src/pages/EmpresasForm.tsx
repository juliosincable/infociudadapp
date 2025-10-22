// src/pages/EmpresasForm.tsx

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
    IonGrid, 
    IonRow, 
    IonCol, 
    useIonViewWillEnter,
} from "@ionic/react";
import { save, trash } from "ionicons/icons";
import { useParams, useHistory } from "react-router-dom";
import { useEmpresas } from "../context/EmpresasContext";
import { Empresa } from "../types/types";


// Componente del Formulario (SÓLO CAMPOS)
const FormContent: React.FC<{
    isEditMode: boolean, 
    nombre: string, setNombre: (val: string) => void,
    direccion: string, setDireccion: (val: string) => void,
    telefono: string, setTelefono: (val: string) => void,
    email: string, setEmail: (val: string) => void,
    logoUrl: string, setLogoUrl: (val: string) => void,
    horarioAtencion: string, setHorarioAtencion: (val: string) => void,
    sitioWeb: string, setSitioWeb: (val: string) => void,
    categoria: string, setCategoria: (val: string) => void,
    descripcion: string, setDescripcion: (val: string) => void,
    whatsapp: string, setWhatsapp: (val: string) => void,
    instagram: string, setInstagram: (val: string) => void,
    tiktok: string, setTiktok: (val: string) => void,
    servicios: string[], handleServiceChange: (e: CustomEvent<InputChangeEventDetail>) => void,
    latitud: number, setLatitud: (val: number) => void,
    longitud: number, setLongitud: (val: number) => void,
    handleSubmit: () => Promise<void>,
    handleDelete: () => Promise<void>,
}> = ({
    nombre, setNombre, direccion, setDireccion, telefono, setTelefono, email, setEmail, logoUrl, setLogoUrl, horarioAtencion, setHorarioAtencion, sitioWeb, setSitioWeb, categoria, setCategoria, descripcion, setDescripcion, whatsapp, setWhatsapp, instagram, setInstagram, tiktok, setTiktok, servicios, handleServiceChange, latitud, setLatitud, longitud, setLongitud, isEditMode, handleSubmit, handleDelete
}) => (
    <IonList className="ion-padding-horizontal ion-padding-vertical form-list-content"> 
        
        {/* 💡 ARREGLO CLAVE: Div espaciador para asegurar que el primer campo no quede oculto bajo el header en vistas grandes. */}
        <div style={{ minHeight: '1px' }} className="ion-show-lg-up"></div>

        {/* --- CAMPOS DEL FORMULARIO --- */}
        <IonItem><IonInput label="Nombre de la Empresa" labelPlacement="floating" value={nombre} onIonChange={(e) => setNombre(String(e.detail.value || ''))} required maxlength={100}><span slot="label" style={{color: 'red', marginLeft: '5px'}}>*</span></IonInput></IonItem>
        <IonItem><IonInput label="Dirección" labelPlacement="floating" value={direccion} onIonChange={(e) => setDireccion(String(e.detail.value || ''))} maxlength={200}/></IonItem>
        <IonItem><IonInput label="Teléfono" labelPlacement="floating" value={telefono} onIonChange={(e) => setTelefono(String(e.detail.value || ''))} type="tel" maxlength={20}/></IonItem>
        <IonItem><IonInput label="Email" labelPlacement="floating" value={email} onIonChange={(e) => setEmail(String(e.detail.value || ''))} type="email" maxlength={100}/></IonItem>
        <IonItem><IonInput label="URL Logo" labelPlacement="floating" value={logoUrl} onIonChange={(e) => setLogoUrl(String(e.detail.value || ''))} type="url" maxlength={255}/></IonItem>
        <IonItem><IonInput label="Horario de Atención" labelPlacement="floating" value={horarioAtencion} onIonChange={(e) => setHorarioAtencion(String(e.detail.value || ''))} maxlength={100}/></IonItem>
        <IonItem><IonInput label="Sitio Web" labelPlacement="floating" value={sitioWeb} onIonChange={(e) => setSitioWeb(String(e.detail.value || ''))} type="url" maxlength={255}/></IonItem>
        <IonItem><IonInput label="Categoría" labelPlacement="floating" value={categoria} onIonChange={(e) => setCategoria(String(e.detail.value || ''))} maxlength={50}/></IonItem>
        <IonItem><IonTextarea label="Descripción" labelPlacement="floating" value={descripcion} onIonChange={(e) => setDescripcion(String(e.detail.value || ''))} rows={3} maxlength={500}/></IonItem>
        <IonItem><IonInput label="WhatsApp" labelPlacement="floating" value={whatsapp} onIonChange={(e) => setWhatsapp(String(e.detail.value || ''))} type="tel" maxlength={20}/></IonItem>
        <IonItem><IonInput label="Instagram (sin @)" labelPlacement="floating" value={instagram} onIonChange={(e) => setInstagram(String(e.detail.value || ''))} maxlength={50}/></IonItem>
        <IonItem><IonInput label="TikTok (sin @)" labelPlacement="floating" value={tiktok} onIonChange={(e) => setTiktok(String(e.detail.value || ''))} maxlength={50}/></IonItem>
        <IonItem><IonInput label="Servicios (separados por coma)" labelPlacement="floating" value={servicios.join(', ')} onIonChange={handleServiceChange} maxlength={500}/></IonItem>
        <IonItem><IonInput label="Latitud (GPS)" labelPlacement="floating" value={latitud} onIonChange={(e) => setLatitud(parseFloat(String(e.detail.value || '0')) || 0)} type="number" step="any"/></IonItem>
        <IonItem><IonInput label="Longitud (GPS)" labelPlacement="floating" value={longitud} onIonChange={(e) => setLongitud(parseFloat(String(e.detail.value || '0')) || 0)} type="number" step="any"/></IonItem>
        
        {/* === BOTONES DENTRO DEL CONTENIDO DEL FORMULARIO === */}
        <IonGrid className="ion-padding-vertical">
            <IonRow>
                {isEditMode && (
                    <IonCol size="12" sizeMd="6">
                        <IonButton expand="full" color="danger" onClick={handleDelete} type="button">
                            <IonIcon slot="start" icon={trash} />
                            Eliminar
                        </IonButton>
                    </IonCol>
                )}
                <IonCol size="12" sizeMd={isEditMode ? "6" : "12"}>
                    <IonButton expand="full" color="primary" onClick={handleSubmit}>
                        <IonIcon slot="start" icon={save} />
                        {isEditMode ? "Actualizar" : "Guardar"}
                    </IonButton>
                </IonCol>
            </IonRow>
        </IonGrid>
        {/* =================================================== */}
    </IonList>
);

const EmpresasForm: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const history = useHistory();
    const {
        empresas, fetchEmpresas, createEmpresa, updateEmpresa, deleteEmpresa, isLoading, error, clearError,
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
    
    // Funciones auxiliares (se mantienen sin cambios)
    const initializeForm = (currentEmpresas: Empresa[]) => {
        console.log(`[EmpresasForm] Inicializando formulario para ID: ${id || 'Nuevo'}`);
        
        if (id) { 
            setIsEditMode(true);
            
            if (currentEmpresas.length === 0 && !isLoading) {
                return;
            }

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
                setToastMessage("Empresa no encontrada.");
                setShowToast(true);
            }
        } else { 
            setIsEditMode(false);
            setNombre(""); setDireccion(""); setTelefono(""); setEmail(""); setLogoUrl(""); setHorarioAtencion("");
            setSitioWeb(""); setCategoria(""); setDescripcion(""); setWhatsapp(""); setInstagram(""); setTiktok("");
            setServicios([]); setLatitud(0); setLongitud(0);
        }
    };
    
    useIonViewWillEnter(() => {
        if (id && empresas.length === 0 && !isLoading) {
            fetchEmpresas();
        } else {
            initializeForm(empresas);
        }
    });

    useEffect(() => {
        if (id && empresas.length > 0) {
            initializeForm(empresas);
        }
    }, [empresas, id]); 

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

    const handleSubmit = async () => {
        
        if (!nombre) {
            setToastMessage("El nombre de la empresa es obligatorio.");
            setShowToast(true);
            return;
        }

        try {
            let successMessage = "";
            const commonData = {
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

            if (isEditMode) {
                const empresaToUpdate: Empresa = {
                    id: id!,
                    ...commonData,
                    servicios: commonData.servicios || [], 
                    ubicacionGps: commonData.ubicacionGps,
                };
                await updateEmpresa(id!, empresaToUpdate);
                successMessage = "Empresa actualizada con éxito.";
            } else {
                await createEmpresa(commonData);
                successMessage = "Empresa agregada con éxito.";
                // Limpiar campos después de crear
                setNombre(""); setDireccion(""); setTelefono(""); setEmail(""); setLogoUrl(""); setHorarioAtencion("");
                setSitioWeb(""); setCategoria(""); setDescripcion(""); setWhatsapp(""); setInstagram(""); setTiktok("");
                setServicios([]); setLatitud(0); setLongitud(0);
            }

            setToastMessage(successMessage);
            setShowToast(true);

            setTimeout(() => {
                if (isEditMode) {
                    history.goBack();
                } 
            }, 3000);

        } catch (e: any) {
            console.error("Error en handleSubmit:", e);
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
                    <IonTitle>{isEditMode ? "Editar Empresa" : "Nueva Empresa"}</IonTitle>
                </IonToolbar>
            </IonHeader>
            
            <IonContent fullscreen>
                
                {/* 1. VISTA DE ESCRITORIO: Tarjeta centrada con scroll interno. Visible solo en > 992px */}
                <div className="ion-show-lg-up desktop-card-wrapper">
                    <IonGrid className="main-container desktop-container-fix">
                        <IonRow>
                            <IonCol>
                                <IonContent 
                                    scrollY={true} 
                                    className="desktop-scroll-content" 
                                >
                                    <FormContent 
                                        isEditMode={isEditMode}
                                        nombre={nombre} setNombre={setNombre} 
                                        direccion={direccion} setDireccion={setDireccion}
                                        telefono={telefono} setTelefono={setTelefono} 
                                        email={email} setEmail={setEmail}
                                        logoUrl={logoUrl} setLogoUrl={setLogoUrl} 
                                        horarioAtencion={horarioAtencion} setHorarioAtencion={setHorarioAtencion}
                                        sitioWeb={sitioWeb} setSitioWeb={setSitioWeb} 
                                        categoria={categoria} setCategoria={setCategoria}
                                        descripcion={descripcion} setDescripcion={setDescripcion} 
                                        whatsapp={whatsapp} setWhatsapp={setWhatsapp}
                                        instagram={instagram} setInstagram={setInstagram} 
                                        tiktok={tiktok} setTiktok={setTiktok}
                                        servicios={servicios} handleServiceChange={handleServiceChange} 
                                        latitud={latitud} setLatitud={setLatitud}
                                        longitud={longitud} setLongitud={setLongitud}
                                        handleSubmit={handleSubmit}
                                        handleDelete={handleDelete}
                                    />
                                </IonContent>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                
                {/* 2. VISTA DE MÓVIL: Contenido normal. Visible solo en < 992px */}
                <div className="ion-hide-lg-up">
                    <FormContent 
                        isEditMode={isEditMode} 
                        nombre={nombre} setNombre={setNombre} 
                        direccion={direccion} setDireccion={setDireccion}
                        telefono={telefono} setTelefono={setTelefono} 
                        email={email} setEmail={setEmail}
                        logoUrl={logoUrl} setLogoUrl={setLogoUrl} 
                        horarioAtencion={horarioAtencion} setHorarioAtencion={setHorarioAtencion}
                        sitioWeb={sitioWeb} setSitioWeb={setSitioWeb} 
                        categoria={categoria} setCategoria={setCategoria}
                        descripcion={descripcion} setDescripcion={setDescripcion} 
                        whatsapp={whatsapp} setWhatsapp={setWhatsapp}
                        instagram={instagram} setInstagram={setInstagram} 
                        tiktok={tiktok} setTiktok={setTiktok}
                        servicios={servicios} handleServiceChange={handleServiceChange} 
                        latitud={latitud} setLatitud={setLatitud}
                        longitud={longitud} setLongitud={setLongitud}
                        handleSubmit={handleSubmit}
                        handleDelete={handleDelete}
                    />
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