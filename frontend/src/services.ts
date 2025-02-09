import { Empresa } from "./types";

const API_URL = "/api/empresas";

export const fetchEmpresas = async (
  setEmpresas: (empresas: Empresa[]) => void
) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    setEmpresas(data);
  } catch (error) {
    console.error("Error fetching empresas:", error);
  }
};

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
    const data = await response.json();
    setEmpresas((prev: Empresa[]) => [...prev, data]);
  } catch (error) {
    console.error("Error creating empresa:", error);
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
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setEmpresas((prev: Empresa[]) => prev.filter((e: Empresa) => e._id !== id));
  } catch (error) {
    console.error("Error deleting empresa:", error);
  }
};
