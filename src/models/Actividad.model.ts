import { ModeloBase } from "../types/ModeloBase.model";

export class Actividad extends ModeloBase {
  clave?: string;
  nombre?: string;
  descripcion?: string;

  static CLASS_NAME = "Actividad";
  static BASE_ROUTE = "/actividades";

  static ENDPOINTS = {
    DEFAULT: "api/actividad.json",
  };

  static EXPAND = {
    DEFAULT: "eventos",
  };

  static fromJson(data: Partial<Actividad>) {
    return new Actividad(data);
  }

  static fromJsonList(data: Partial<Actividad>[]) {
    return data.map((_data) => new Actividad(_data));
  }

  constructor(data: Partial<Actividad> = {}) {
    super(data);
  }
}