import type { Evento } from "./Evento.model";
import { ModeloBase } from "../types/ModeloBase.model";

export class CategoriaEvento extends ModeloBase {
  clave?: string;
  nombre?: string;
  descripcion?: string;

  eventos?: Evento[];

  static CLASS_NAME = "CategoriaEvento";
  static BASE_ROUTE = "/categorias-evento";

  static ENDPOINTS = {
    DEFAULT: "api/categoria-evento.json",
  };

  static EXPAND = {
    DEFAULT: "eventos",
  };

  static fromJson(data: Partial<CategoriaEvento>) {
    return new CategoriaEvento(data);
  }

  static fromJsonList(data: Partial<CategoriaEvento>[]) {
    return data.map((_data) => new CategoriaEvento(_data));
  }

  constructor(data: Partial<CategoriaEvento> = {}) {
    super(data);
  }
}
