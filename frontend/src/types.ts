// src/types.ts

export interface Empresa {
    id: string;
    nombre: string;
    direccion: string;
    categoria: string;
    whatsapp: string;
    instagram: string;
}

export interface EmpresasContextType {
    empresas: Empresa[];
    fetchEmpresas: () => Promise<void>;
    createEmpresa: (empresa: Omit<Empresa, "id">) => Promise<void>;
    updateEmpresa: (id: string, empresa: Empresa) => Promise<void>;
    deleteEmpresa: (id: string) => Promise<void>;
    // *** CORRECCIÓN CLAVE AQUÍ: Agregamos isLoading y error al tipo
    isLoading: boolean;
    error: string | null;
}