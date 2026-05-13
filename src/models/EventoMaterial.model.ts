import type { Evento } from "./Evento.model";
import type { Material } from "./Material.model";

export class EventoMaterial {
  id?: string;
  idEvento?: string;
  idMaterial?: string;
  cantidad?: number;
  creado?: string;
  modificado?: string;
  eliminado?: string;
  evento?: Evento;
  material?: Material;

  static CLASS_NAME = "Evento Material";
  static BASE_ROUTE = "/eventos-materiales";

  static ENDPOINTS = {
    DEFAULT: "api/evento-material.json",
  };

  static EXPAND = {
    DEFAULT: "evento, material",
  };

  static fromJson(data: Partial<EventoMaterial>) {
    return new EventoMaterial(data);
  }

  static fromJsonList(data: Partial<EventoMaterial>[]) {
    return data.map((_data) => new EventoMaterial(_data));
  }

  constructor(data: Partial<EventoMaterial> = {}) {
    Object.assign(this, data);
  }
}
