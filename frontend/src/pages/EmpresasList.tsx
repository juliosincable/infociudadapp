import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    IonPage,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonToast,
    IonNote,
    InputCustomEvent,
} from '@ionic/react';
import { useEmpresas } from "../EmpresasContext"; // Importar el hook y el contexto

// --- Tipos (Idealmente definidos en archivos separados) ---

interface Empresa {
    id?: string;
    nombre: string;
    direccion: string;
    categoria: string;
    whatsapp: string;
    instagram: string;
}

const initialFormData: Omit<Empresa, 'id'> = {
    nombre: "",
    direccion: "",
    categoria: "",
    whatsapp: "",
    instagram: "",
};

const EmpresaForm: React.FC = () => {
    // --- Contexto ---
    const { fetchEmpresas, createEmpresa } = useEmpresas(); // Usar el hook personalizado

    // --- Estado ---
    const [formData, setFormData] = useState<Omit<Empresa, 'id'>>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'success',
    });

    // --- Efectos ---
    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchEmpresas();
            } catch (error) {
                console.error("Error fetching initial data:", error);
                setShowToast({ show: true, message: 'Error al cargar datos iniciales.', color: 'danger' });
            }
        };
        loadData();
    }, [fetchEmpresas]);

    // --- Manejadores ---
    const handleChange = useCallback((event: InputCustomEvent) => {
        const target = event.target as HTMLIonInputElement;
        const name = target.name;
        const value = event.detail.value ?? '';

        if (name && name in formData) {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
            if (formError) setFormError(null);
        } else {
            console.warn(`Input name "${name}" not found in formData state.`);
        }
    }, [formData, formError]);

    const validateForm = (): boolean => {
        if (!formData.nombre.trim()) {
            setFormError("El nombre es obligatorio.");
            return false;
        }
        setFormError(null);
        return true;
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setFormError(null);

        try {
            await createEmpresa(formData);
            setShowToast({ show: true, message: 'Empresa guardada con éxito.', color: 'success' });
            setFormData(initialFormData);
        } catch (error: any) {
            console.error("Error creating empresa:", error);
            const errorMessage = error?.message || 'Ocurrió un error al guardar.';
            setFormError(errorMessage);
            setShowToast({ show: true, message: errorMessage, color: 'danger' });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, createEmpresa, fetchEmpresas, validateForm]);

    // --- Renderizado ---
    return (
        <IonPage placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <form onSubmit={handleSubmit} style={{ padding: '16px' }}>
                <IonList lines="full" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="stacked" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Nombre (*)</IonLabel>
                        <IonInput
                            name="nombre"
                            value={formData.nombre}
                            onIonChange={handleChange}
                            placeholder="Ej: Mi Negocio S.A."
                            required
                            disabled={isSubmitting}
                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        />
                    </IonItem>

                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="stacked" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Dirección</IonLabel>
                        <IonInput
                            name="direccion"
                            value={formData.direccion}
                            onIonChange={handleChange}
                            placeholder="Ej: Av. Principal #123"
                            disabled={isSubmitting} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        />
                    </IonItem>

                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="stacked" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Categoría</IonLabel>
                        <IonInput
                            name="categoria"
                            value={formData.categoria}
                            onIonChange={handleChange}
                            placeholder="Ej: Restaurante, Tienda, Servicio"
                            disabled={isSubmitting} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        />
                    </IonItem>

                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="stacked" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>WhatsApp</IonLabel>
                        <IonInput
                            type="tel"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onIonChange={handleChange}
                            placeholder="Ej: +584121234567"
                            disabled={isSubmitting} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        />
                    </IonItem>

                    <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IonLabel position="stacked" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Instagram</IonLabel>
                        <IonInput
                            name="instagram"
                            value={formData.instagram}
                            onIonChange={handleChange}
                            placeholder="Ej: @miempresa"
                            disabled={isSubmitting} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        />
                    </IonItem>

                    {formError && (
                        <IonItem lines="none" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <IonNote color="danger" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{formError}</IonNote>
                        </IonItem>
                    )}
                </IonList>

                <div style={{ marginTop: '20px' }}>
                    <IonButton type="submit" expand="block" disabled={isSubmitting} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {isSubmitting ? 'Guardando...' : 'Guardar Empresa'}
                    </IonButton>
                </div>
            </form>

            <IonLoading isOpen={isSubmitting} message={'Procesando...'} />

            <IonToast
                isOpen={showToast.show}
                message={showToast.message}
                duration={3000}
                color={showToast.color}
                onDidDismiss={() => setShowToast({ show: false, message: '', color: 'success' })}
                position="top"
            />
        </IonPage>
    );
};

export default EmpresaForm;