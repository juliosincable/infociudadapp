import React, { createContext, useContext, ReactNode, useState } from "react";
import { Empresa, EmpresasContextProps } from "./types";
import { fetchEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from "./services";

const EmpresasContext = createContext<EmpresasContextProps | undefined>(undefined);

export const useEmpresas = () => {
  const context = useContext(EmpresasContext);
  if (!context) {
    throw new Error("useEmpresas must be used within an EmpresasProvider");
  }
  return context;
};

interface EmpresasProviderProps {
  children: ReactNode;
}

export const EmpresasProvider: React.FC<EmpresasProviderProps> = ({ children }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  return (
    <EmpresasContext.Provider
      value={{
        empresas,
        fetchEmpresas: () => fetchEmpresas(setEmpresas),
        createEmpresa: (empresa: Empresa) => createEmpresa(empresa, setEmpresas),
        updateEmpresa: (empresaId: string, empresa: Empresa) => updateEmpresa(empresaId, empresa, setEmpresas),
        deleteEmpresa: (id: string) => deleteEmpresa(id, setEmpresas),
      }}
    >
      {children}
    </EmpresasContext.Provider>
  );
};
