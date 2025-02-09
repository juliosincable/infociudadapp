import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Empresa, EmpresasContextProps } from "./types";
import { fetchEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from "./services";

const EmpresasContext = createContext<EmpresasContextProps | undefined>(undefined);

export const EmpresasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const fetchEmpresasHandler = async () => {
    try {
      await fetchEmpresas(setEmpresas);
    } catch (error) {
      console.error("Error fetching empresas:", error);
    }
  };

  const createEmpresaHandler = async (empresa: Empresa) => {
    try {
      await createEmpresa(empresa, setEmpresas);
    } catch (error) {
      console.error("Error creating empresa:", error);
    }
  };

  const updateEmpresaHandler = async (id: string, empresa: Empresa) => {
    try {
      await updateEmpresa(id, empresa, setEmpresas);
    } catch (error) {
      console.error("Error updating empresa:", error);
    }
  };

  const deleteEmpresaHandler = async (id: string) => {
    try {
      await deleteEmpresa(id, setEmpresas);
    } catch (error) {
      console.error("Error deleting empresa:", error);
    }
  };

  return (
    <EmpresasContext.Provider value={{ 
      empresas, 
      fetchEmpresas: fetchEmpresasHandler, 
      createEmpresa: createEmpresaHandler, 
      updateEmpresa: updateEmpresaHandler, 
      deleteEmpresa: deleteEmpresaHandler 
    }}>
      {children}
    </EmpresasContext.Provider>
  );
};

export const useEmpresas = (): EmpresasContextProps => {
  const context = useContext(EmpresasContext);
  if (!context) {
    throw new Error('useEmpresas must be used within an EmpresasProvider');
  }
  return context;
};
