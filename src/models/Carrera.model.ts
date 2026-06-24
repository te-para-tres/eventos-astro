import type { UnidadAcademica } from "./UnidadAcademica.model";
import { ModeloBase } from "../types/ModeloBase.model";
import type { Evento } from "./Evento.model";

export class Carrera extends ModeloBase {
  idUnidadAcademica?: string;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  estado?: string;
  unidadAcademica?: UnidadAcademica;
  eventos?: Evento[];

  static CLASS_NAME = "Carrera";
  static BASE_ROUTE = "/carreras";

  static ENDPOINTS = {
    DEFAULT: "api/carreras.json",
  };

  static EXPAND = {
    DEFAULT: "unidadAcademica,eventos",
  };

  static fromJson(data: Partial<Carrera>) {
    return new Carrera(data);
  }

  static fromJsonList(data: Partial<Carrera>[]) {
    return data.map((_data) => new Carrera(_data));
  }

  constructor(data: Partial<Carrera> = {}) {
    super(data);
  }
}
