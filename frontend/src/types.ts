export interface Empresa {
  id: string;
  nombre: string;
  direccion: string;
  categoria: string;
  whatsapp: string;
  instagram: string;
}

export interface EmpresasContextProps {
  empresas: Empresa[];
  fetchEmpresas: () => Promise<void>;
  createEmpresa: (empresa: Omit<Empresa, "id">) => Promise<void>;
  updateEmpresa: (id: string, empresa: Omit<Empresa, "id">) => Promise<void>;
  deleteEmpresa: (id: string) => Promise<void>;
}