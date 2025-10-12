// frontend/src/services/services.ts

import { Empresa } from "../types/types"; // Asegúrate de que la ruta sea correcta según donde esté este archivo

// Define la URL base de tu API. Si tu backend está en el mismo VPS y el frontend
// lo sirve un proxy (como Nginx) que redirige /api, esta URL relativa está bien.
// Si no, deberías poner la IP o dominio completo de tu backend aquí (ej. 'http://tu_ip_backend:4000/api/empresas')
const API_URL = "/api/empresas";

// --- FUNCIONES DE SERVICIO REFRACTORIZADAS ---
// Todas las funciones ahora SÓLO hacen la llamada a la API y devuelven los datos o el resultado.
// Ya NO reciben ni actualizan 'setEmpresas' u otros estados de React.

// Obtener la lista de empresas
export const fetchEmpresasApi = async (): Promise<Empresa[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            // Intenta obtener un mensaje de error más detallado del servidor
            const errorBody = await response.text();
            throw new Error(`Error al obtener empresas: ${response.status} - ${errorBody}`);
        }
        const data: Empresa[] = await response.json();
        return data; // Devuelve los datos directamente
    } catch (error) {
        console.error("Error en fetchEmpresasApi:", error);
        throw error; // Propaga el error para que el Contexto (o quien llame) lo maneje
    }
};

// Crear una nueva empresa
export const createEmpresaApi = async (empresa: Omit<Empresa, "id">): Promise<Empresa> => {
    // Puedes mantener validaciones básicas aquí o moverlas al Contexto/Componente
    if (!empresa.nombre || empresa.nombre.trim().length === 0) {
        throw new Error("El nombre de la empresa es requerido para crear.");
    }
    if (!empresa.categoria || empresa.categoria.trim().length === 0) {
        throw new Error("La categoría de la empresa es requerida para crear.");
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(empresa),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error al crear empresa: ${response.status} - ${errorBody}`);
        }

        const data: Empresa = await response.json();
        return data; // Devuelve la empresa creada
    } catch (error) {
        console.error("Error en createEmpresaApi:", error);
        throw error; // Propaga el error
    }
};

// Actualizar una empresa existente
export const updateEmpresaApi = async (id: string, empresa: Omit<Empresa, "id">): Promise<Empresa> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(empresa),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error al actualizar empresa: ${response.status} - ${errorBody}`);
        }
        const data: Empresa = await response.json();
        return data; // Devuelve la empresa actualizada
    } catch (error) {
        console.error("Error en updateEmpresaApi:", error);
        throw error; // Propaga el error
    }
};

// Eliminar una empresa existente
export const deleteEmpresaApi = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error al eliminar empresa: ${response.status} - ${errorBody}`);
        }
        // Si la operación fue exitosa, no devuelve datos, solo se completa la promesa.
    } catch (error) {
    console.error("Error en deleteEmpresaApi:", error);
        throw error; // Propaga el error
    }
};