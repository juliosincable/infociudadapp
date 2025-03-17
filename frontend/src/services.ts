import { Empresa } from "./types";

const API_URL = "/api/empresas";

export const fetchEmpresas = async (
  setEmpresas: (empresas: Empresa[]) => void
) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error fetching empresas: ${response.statusText}`);
    }
    const data = await response.json();
    setEmpresas(data);
  } catch (error) {
    console.error("Error fetching empresas:", error);
  }
};

// Crear una nueva empresa
export const createEmpresa = async (
  empresa: Empresa,
  setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void
) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(empresa)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating empresa: ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    setEmpresas((prev: Empresa[]) => [...prev, data]);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating empresa:", error.message);
    } else {
      console.error("Error creating empresa:", error);
    }
  }
};


export const updateEmpresa = async (
  id: string,
  empresa: Empresa,
  setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void
) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(empresa)
    });
    if (!response.ok) {
      throw new Error(`Error updating empresa: ${response.statusText}`);
    }
    const data = await response.json();
    setEmpresas((prev: Empresa[]) =>
      prev.map((e: Empresa) => (e._id === id ? data : e))
    );
  } catch (error) {
    console.error("Error updating empresa:", error);
  }
};

export const deleteEmpresa = async (
  id: string,
  setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void
) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Error deleting empresa: ${response.statusText}`);
    }
    setEmpresas((prev: Empresa[]) => prev.filter((e: Empresa) => e._id !== id));
  } catch (error) {
    console.error("Error deleting empresa:", error);
  }
};
