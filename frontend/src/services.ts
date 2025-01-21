import axios from "axios";
import { Empresa } from "./types";

const API_URL = "http://localhost:4000/empresas";

export const fetchEmpresas = async (setEmpresas: (empresas: Empresa[]) => void) => {
  try {
    const response = await axios.get<Empresa[]>(API_URL);
    setEmpresas(response.data);
  } catch (error) {
    console.error("Error fetching empresas:", error);
  }
};

export const createEmpresa = async (empresa: Empresa, setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void) => {
  try {
    const response = await axios.post<Empresa>(API_URL, empresa);
    setEmpresas((prev: Empresa[]) => [...prev, response.data]);
  } catch (error) {
    console.error("Error creating empresa:", error);
  }
};

export const updateEmpresa = async (id: string, empresa: Empresa, setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void) => {
  try {
    const response = await axios.put<Empresa>(`${API_URL}/${id}`, empresa);
    setEmpresas((prev: Empresa[]) => prev.map((e: Empresa) => (e._id === id ? response.data : e)));
  } catch (error) {
    console.error("Error updating empresa:", error);
  }
};

export const deleteEmpresa = async (id: string, setEmpresas: (empresas: Empresa[] | ((prev: Empresa[]) => Empresa[])) => void) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    setEmpresas((prev: Empresa[]) => prev.filter((e: Empresa) => e._id !== id));
  } catch (error) {
    console.error("Error deleting empresa:", error);
  }
};
