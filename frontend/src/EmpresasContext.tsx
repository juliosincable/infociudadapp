// frontend/src/EmpresasContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Empresa, EmpresasContextType } from './types';

const EmpresasContext = createContext<EmpresasContextType | undefined>(undefined);

export const EmpresasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- ¡Importante! Define la URL de tu API aquí ---
  // 'backend' es el nombre del servicio Docker del backend, y 4000 es el puerto interno del backend.
  const API_URL = '/api/empresas';

  const fetchEmpresas = async () => {
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
  };

  const createEmpresa = async (newEmpresa: Omit<Empresa, 'id'>) => {
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
  };

  const updateEmpresa = async (id: string, updatedEmpresa: Empresa) => {
      setIsLoading(true);
      setError(null);
      try {
          console.log("Updating empresa:", id, updatedEmpresa);
          const response = await fetch(`<span class="math-inline">\{API\_URL\}/</span>{id}`, {
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
  };

  const deleteEmpresa = async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
          console.log("Deleting empresa:", id);
          const response = await fetch(`<span class="math-inline">\{API\_URL\}/</span>{id}`, {
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
  };

  useEffect(() => {
      fetchEmpresas();
  }, []);

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