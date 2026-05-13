import type { UnidadAcademica } from "./UnidadAcademica.model";

export class Carrera {
  id?: string;
  idUnidadAcademica?: string;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  estado?: string;
  creado?: string;
  modificado?: string;
  unidadAcademica?: UnidadAcademica;

  static CLASS_NAME = "Carrera";
  static BASE_ROUTE = "/carreras";

  static ENDPOINTS = {
    DEFAULT: "api/carreras.json",
  };

  static EXPAND = {
    DEFAULT: "unidadAcademica",
  };

  static fromJson(data: Partial<Carrera>) {
    return new Carrera(data);
  }

  static fromJsonList(data: Partial<Carrera>[]) {
    return data.map((_data) => new Carrera(_data));
  }

  constructor(data: Partial<Carrera> = {}) {
    Object.assign(this, data);
  }
}
