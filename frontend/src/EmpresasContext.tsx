import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Empresa, EmpresasContextType } from './types';

const EmpresasContext = createContext<EmpresasContextType | undefined>(undefined);

export const EmpresasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = '/api/empresas'; // Asegúrate de que esta URL sea accesible desde el frontend.

  // Envuelve fetchEmpresas en useCallback para que su referencia no cambie en cada render
  const fetchEmpresas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching empresas from API...");
      const response = await fetch(API_URL);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      const data: Empresa[] = await response.json();
      setEmpresas(data);
    } catch (err: any) {
      console.error("Error fetching empresas:", err);
      setError(err.message || "Error al cargar empresas.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]); // Dependencia: API_URL

  // Envuelve createEmpresa en useCallback
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
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      const createdEmpresa: Empresa = await response.json();
      setEmpresas(prev => [...prev, createdEmpresa]);
    } catch (err: any) {
      console.error("Error creating empresa:", err);
      setError(err.message || "Error al crear empresa.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, setEmpresas, setIsLoading, setError]); // Dependencias: funciones de actualización de estado y API_URL

  // Envuelve updateEmpresa en useCallback y corrige la sintaxis de la URL
  const updateEmpresa = useCallback(async (id: string, updatedEmpresa: Empresa) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Updating empresa:", id, updatedEmpresa);
      const response = await fetch(`${API_URL}/${id}`, { // SINTAXIS CORREGIDA AQUÍ
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmpresa),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      setEmpresas(prev => prev.map(emp => (emp.id === id ? updatedEmpresa : emp)));
    } catch (err: any) {
      console.error("Error updating empresa:", err);
      setError(err.message || "Error al actualizar empresa.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, setEmpresas, setIsLoading, setError]); // Dependencias

  // Envuelve deleteEmpresa en useCallback y corrige la sintaxis de la URL
  const deleteEmpresa = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Deleting empresa:", id);
      const response = await fetch(`${API_URL}/${id}`, { // SINTAXIS CORREGIDA AQUÍ
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      setEmpresas(prev => prev.filter(emp => emp.id !== id));
    } catch (err: any) {
      console.error("Error deleting empresa:", err);
      setError(err.message || "Error al eliminar empresa.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, setEmpresas, setIsLoading, setError]); // Dependencias

  // Este useEffect para la carga inicial está bien, se ejecuta solo una vez.
  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]); // Ahora fetchEmpresas es una dependencia porque está envuelta en useCallback

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