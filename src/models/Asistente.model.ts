import { ModeloBase } from "../types/ModeloBase.model";

export class Asistente extends ModeloBase {
  idUnidadAcademica?: string;
  idCarrera?: string;
  carrera?: string;
  expediente?: string;
  nombre?: string;

  static CLASS_NAME = "Asistente";
  static BASE_ROUTE = "/asistente";

  static ENDPOINTS = {
    DEFAULT: "api/asistente.json",
  };

  static EXPAND = {
    DEFAULT: "asistenteEventos",
  };

  static fromJson(data: Partial<Asistente>) {
    return new Asistente(data);
  }

  static fromJsonList(data: Partial<Asistente>[]) {
    return data.map((_data) => new Asistente(_data));
  }

  constructor(data: Partial<Asistente> = {}) {
    super(data);
  }
}
