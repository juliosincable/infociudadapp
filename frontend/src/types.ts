// En tu archivo src/types.ts

export interface Empresa {
    id: string; // El ID de la empresa (generalmente manejado por el backend, pero esencial para operaciones como update/delete)
    nombre: string; // ¡Este es el único campo que será obligatorio según tu petición!
    
    // Todos los demás campos ahora son opcionales
    direccion?: string;
    categoria?: string;
    whatsapp?: string; 
    instagram?: string;
    telefono?: string;
    email?: string;
    descripcion?: string; 
    logoUrl?: string;
    horarioAtencion?: string;
    sitioWeb?: string;
    servicios?: string[]; // Array de strings
    ubicacionGps?: { // Objeto para coordenadas GPS
        lat: number;
        lng: number;
    };
    tiktok?: string;
}

export interface EmpresasContextType {
    empresas: Empresa[];
    fetchEmpresas: () => Promise<void>;
    createEmpresa: (empresa: Omit<Empresa, "id">) => Promise<void>; // Omitimos 'id' al crear, ya que el backend lo generaría
    updateEmpresa: (id: string, empresa: Empresa) => Promise<void>;
    deleteEmpresa: (id: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void; // Mantendremos esta función para una buena gestión de errores en el Toast
}