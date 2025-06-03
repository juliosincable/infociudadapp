// src/EmpresasContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Empresa, EmpresasContextType } from './types'; // Asegúrate de que 'types' esté correctamente definido

const EmpresasContext = createContext<EmpresasContextType | undefined>(undefined);

export const EmpresasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Asegúrate de que esta URL sea la correcta y accesible para tu backend.
    // Por ejemplo, si tu backend corre en localhost:3001 y tienes una ruta /api/empresas
    // en desarrollo, podrías necesitar 'http://localhost:3001/api/empresas'.
    // En producción, el proxy de Vite/Create React App o tu servidor web lo manejaría.
    const API_URL = '/api/empresas'; 

    const fetchEmpresas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching empresas from API...");
            const response = await fetch(API_URL);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status} - ${errorText}`);
            }
            const data: Empresa[] = await response.json();
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
            console.log("Creating empresa:", newEmpresa);
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
            setEmpresas(prev => [...prev, createdEmpresa]); // Agrega la nueva empresa al estado local
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
            console.log("Updating empresa:", id, updatedEmpresa);
            // **¡La corrección crucial aquí! Usando template literals para la URL.**
            const response = await fetch(`${API_URL}/${id}`, { 
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
            // Actualiza la empresa en el estado local inmutablemente
            setEmpresas(prev => prev.map(emp => (emp.id === id ? updatedEmpresa : emp)));
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
            console.log("Deleting empresa:", id);
            // **¡La corrección crucial aquí! Usando template literals para la URL.**
            const response = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status} - ${errorText}`);
            }
            // Filtra la empresa eliminada del estado local
            setEmpresas(prev => prev.filter(emp => emp.id !== id));
        } catch (err: any) {
            console.error("Error al eliminar empresa:", err);
            setError(err.message || "Error al eliminar empresa.");
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    // Este useEffect se ejecuta una sola vez para cargar las empresas inicialmente.
    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]); // 'fetchEmpresas' es una dependencia porque está envuelta en useCallback.

    const contextValue: EmpresasContextType = {
        empresas,
        fetchEmpresas,
        createEmpresa,
        updateEmpresa,
        deleteEmpresa,
        isLoading,
        error,
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