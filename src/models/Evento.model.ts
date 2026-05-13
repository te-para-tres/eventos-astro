import type { Carrera } from "./Carrera.model";
import type { CategoriaEvento } from "./CategoriaEvento.model";
import type { EventoMaterial } from "./EventoMaterial.model";
import type { EventoMedia } from "./EventoMedia.model";
import type { Media } from "./Media.model";
import type { UnidadAcademica } from "./UnidadAcademica.model";

export class Evento {
  id?: string;
  idUnidadAcademica?: string;
  idCategoriaEvento?: string;
  idCarrera?: string;
  idImagenDestacada?: string;
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  capacidadMaxima?: number;
  capacidadMinima?: number;
  estado?: string;
  lugar?: string;
  latitud?: number;
  longitud?: number;
  creado?: string;
  modificado?: string;
  eliminado?: string;
  fechaCancelacion?: string;
  visibilidad?: string;

  eventoMaterial?: EventoMaterial[];
  eventoMedia?: EventoMedia[];
  carrera?: Carrera;
  categoriaEvento?: CategoriaEvento;
  imagenDestacada?: Media;
  unidadAcademica?: UnidadAcademica;

  static CLASS_NAME = "Evento";
  static BASE_ROUTE = "/eventos";

  static ENDPOINTS = {
    DEFAULT: "api/evento.json",
  };

  static EXPAND = {
    DEFAULT: "carrera,categoriaEvento,imagenDestacada,unidadAcademica,qr,eventoMaterials,eventoMedia",
  };

  static fromJson(data: Partial<Evento>) {
    return new Evento(data);
  }

  static fromJsonList(data: Partial<Evento>[]) {
    return data.map((_data) => new Evento(_data));
  }

  constructor(data: Partial<Evento> = {}) {
    Object.assign(this, data);
  }
}
