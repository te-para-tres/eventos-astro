import type { TPaginacion } from "../types/responded";

export type CategoriaResponseItem = {
  id: string;
  clave: string;
  nombre: string;
  descripcion: string | null;
  creado: string;
  modificado: string | null;
  eliminado: string | null;
};

export type UnidadAcademicaResponseItem = {
  id: string;
  nombre: string;
  descripcion: string | null;
  telefono: string;
  correo: string;
  estado: string;
  creado: string;
  modificado: string | null;
  eliminado: string | null;
};

export type CatalogoPaginadoResponse<T> = {
  paginacion: TPaginacion;
  resultado: T[];
};
