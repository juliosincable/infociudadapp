// src/EmpresasContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Empresa, EmpresasContextType } from './types'; // Asegúrate de que 'types' esté correctamente definido

const EmpresasContext = createContext<EmpresasContextType | undefined>(undefined);

export const EmpresasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // *******************************************************************
    // ¡CORRECCIÓN CRUCIAL AQUÍ!
    // Apunta directamente a la IP de tu VPS y al puerto de tu backend (4000).
    // Reemplaza '200.6.157.250' con la IP real de tu VPS si es diferente.
    const API_URL = 'http://200.6.157.250:4000/api/empresas'; 
    // *******************************************************************

    const fetchEmpresas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching empresas from API:", API_URL); // Loguea la URL completa
            const response = await fetch(API_URL);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status} - ${errorText}`);
            }
            const data: Empresa[] = await response.json();
            console.log("Datos recibidos de la API en el contexto (fetchEmpresas):", data); 
            setEmpresas(data);
        } catch (err: any) {
            console.error("Error al cargar empresas:", err);
            setError(err.message || "Error al cargar empresas.");
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]); 

    const createEmpresa = useCallback(async (newEmpresa: Omit<Empresa, 'id'>) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Creating empresa - datos enviados:", newEmpresa);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmpresa),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status} - ${errorText}`);
            }
            const createdEmpresa: Empresa = await response.json();
            console.log("Empresa creada y recibida del API:", createdEmpresa);
            setEmpresas(prev => [...prev, createdEmpresa]); 
        } catch (err: any) {
            console.error("Error al crear empresa:", err);
            setError(err.message || "Error al crear empresa.");
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    const updateEmpresa = useCallback(async (id: string, updatedEmpresa: Empresa) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log(`Updating empresa con ID: ${id}, datos:`, updatedEmpresa);
            const response = await fetch(`${API_URL.replace('/api/empresas', '')}/${id}`, { // Ajuste para URL base + ID
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEmpresa),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status} - ${errorText}`);
            }
            const fetchedUpdatedEmpresa: Empresa = await response.json(); 
            console.log("Empresa actualizada recibida del API:", fetchedUpdatedEmpresa);
            setEmpresas(prev => prev.map(emp => (emp.id === id ? fetchedUpdatedEmpresa : emp)));
        } catch (err: any) {
            console.error("Error al actualizar empresa:", err);
            setError(err.message || "Error al actualizar empresa.");
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    const deleteEmpresa = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Deleting empresa con ID:", id);
            const response = await fetch(`${API_URL.replace('/api/empresas', '')}/${id}`, { // Ajuste para URL base + ID
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status} - ${errorText}`);
            }
            setEmpresas(prev => prev.filter(emp => emp.id !== id));
            console.log(`Empresa con ID ${id} eliminada del estado local.`);
        } catch (err: any) {
            console.error("Error al eliminar empresa:", err);
            setError(err.message || "Error al eliminar empresa.");
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]); 

    const contextValue: EmpresasContextType = {
        empresas,
        fetchEmpresas,
        createEmpresa,
        updateEmpresa,
        deleteEmpresa,
        isLoading,
        error,
        clearError, 
    };

    return (
        <EmpresasContext.Provider value={contextValue}>
            {children}
        </EmpresasContext.Provider>
    );
};

export const useEmpresas = () => {
    const context = useContext(EmpresasContext);
    if (context === undefined) {
        throw new Error('useEmpresas debe usarse dentro de un EmpresasProvider');
    }
    return context;
};
