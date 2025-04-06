import { Empresa } from "./types";

const API_URL = "/api/empresas";

// Obtener la lista de empresas
export const fetchEmpresas = async (
    setEmpresas: (empresas: Empresa[]) => void
) => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error fetching empresas: ${response.statusText}`);
        }
        const data: Empresa[] = await response.json();
        setEmpresas(data);
    } catch (error) {
        console.error("Error fetching empresas:", error);
    }
};

// Crear una nueva empresa
export const createEmpresa = async (
    empresa: Omit<Empresa, "id">, // Corregido
    setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void
): Promise<void> => { // Corregido
    // Validación básica del frontend
    if (!empresa.nombre || empresa.nombre.trim().length === 0) {
        throw new Error("El nombre es requerido");
    }

    if (!empresa.categoria || empresa.categoria.trim().length === 0) {
        throw new Error("La categoría es requerida");
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
            // Intenta obtener el mensaje de error del servidor
            let errorMessage = response.statusText;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.warn("No se pudo parsear el error del servidor");
            }
            throw new Error(errorMessage);
        }

        const data: Empresa = await response.json();

        // Actualización segura del estado
        setEmpresas((prev: Empresa[]) => [...prev, data]);

    } catch (error) {
        console.error("Error creating empresa:", error);
        throw error;
    }
};

// Actualizar una empresa existente
export const updateEmpresa = async (
    id: string,
    empresa: Omit<Empresa, "id">, // Corregido
    setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void
) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(empresa),
        });
        if (!response.ok) {
            throw new Error(`Error updating empresa: ${response.statusText}`);
        }
        const data: Empresa = await response.json();
        setEmpresas((prev: Empresa[]) =>
            prev.map((e: Empresa) => (e.id === id ? data : e)) // Corregido
        );
    } catch (error) {
        console.error("Error updating empresa:", error);
    }
};

// Eliminar una empresa existente
export const deleteEmpresa = async (
    id: string,
    setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void
) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error(`Error deleting empresa: ${response.statusText}`);
        }
        setEmpresas((prev: Empresa[]) =>
            prev.filter((e: Empresa) => e.id !== id) // Corregido
        );
    } catch (error) {
        console.error("Error deleting empresa:", error);
    }
};