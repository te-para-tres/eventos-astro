import type { Carrera } from "./Carrera.model";
import { ModeloBase } from "../types/ModeloBase.model";

export class UnidadAcademica extends ModeloBase {
  nombre?: string;
  descripcion?: string;
  telefono?: string;
  correo?: string;
  estado?: string;

  carreras?: Carrera[];

  static CLASS_NAME = "UnidadAcademica";
  static BASE_ROUTE = "/unidades-academicas";

  static ENDPOINTS = {
    DEFAULT: "api/unidad-academica.json",
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
    super(data);
  }
}
