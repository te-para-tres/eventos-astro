export type CarreraResponseItem = {
  id: string;
  idUnidadAcademica: string | null;
  nombre: string | null;
  descripcion: string | null;
  tipo: string | null;
  estado: string | null;
  creado: string | null;
  modificado: string | null;
  eliminado: string | null;
  eventos?: EventoResumen[];
  unidadAcademica?: UnidadAcademicaResponseItem | null;
};

export type EventoResumen = {
  id: string;
  nombre: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  lugar: string | null;
};

export type CategoriaResponseItem = {
  id: string;
  nombre: string | null;
};

export type UnidadAcademicaResponseItem = {
  id: string;
  nombre: string | null;
  descripcion: string | null;
  telefono: string | null;
  correo: string | null;
  estado: string | null;
};