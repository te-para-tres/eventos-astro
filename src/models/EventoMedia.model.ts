import type { Evento } from "./Evento.model";
import type { Media } from "./Media.model";

export class EventoMedia {
  id?: string;
  idMedia?: string;
  idEvento?: string;
  creado?: string;
  modificado?: string;
  eliminado?: string;

  evento?: Evento;
  media?: Media;

  static CLASS_NAME = "Evento Media";
  static BASE_ROUTE = "/eventos-media";

  static ENDPOINTS = {
    DEFAULT: "api/evento-media.json",
  };

  static EXPAND = {
    DEFAULT: "evento, media",
  };

  static fromJson(data: Partial<EventoMedia>) {
    return new EventoMedia(data);
  }

  static fromJsonList(data: Partial<EventoMedia>[]) {
    return data.map((_data) => new EventoMedia(_data));
  }

  constructor(data: Partial<EventoMedia> = {}) {
    Object.assign(this, data);
  }
}
