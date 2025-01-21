export interface Empresa {
    _id?: string;
    nombre: string;
    direccion: string;
    categoria: string;
    whatsapp: string;
    instagram: string;
  }
  
  export interface EmpresasContextProps {
    empresas: Empresa[];
    fetchEmpresas: () => Promise<void>;
    createEmpresa: (empresa: Empresa) => Promise<void>;
    updateEmpresa: (id: string, empresa: Empresa) => Promise<void>;
    deleteEmpresa: (id: string) => Promise<void>;
  }
  