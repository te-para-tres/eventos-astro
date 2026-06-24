import type { Carrera } from "./Carrera.model";

export class UnidadAcademica {
  id?: string;
  nombre?: string;
  descripcion?: string;
  telefono?: string;
  correo?: string;
  estado?: string;
  creado?: string;
  modificado?: string;
  eliminado?: string;

  carreras?: Carrera[];

  static CLASS_NAME = "UnidadAcademica";
  static BASE_ROUTE = "/unidades-academicas";

  static ENDPOINTS = {
    DEFAULT: "api/unidades-academicas.json",
  };

  static EXPAND = {
    DEFAULT: "carreras,eventos",
  };

  static fromJson(data: Partial<UnidadAcademica>) {
    return new UnidadAcademica(data);
  }

  static fromJsonList(data: Partial<UnidadAcademica>[]) {
    return data.map((_data) => new UnidadAcademica(_data));
  }

  constructor(data: Partial<UnidadAcademica> = {}) {
    Object.assign(this, data);
  }
}
