import type { Evento } from "./Evento.model";

export class CategoriaEvento {
  id?: string;
  clave?: string;
  nombre?: string;
  descripcion?: string;
  creado?: string;
  modificado?: string;
  eliminado?: string;

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
    Object.assign(this, data);
  }
}
