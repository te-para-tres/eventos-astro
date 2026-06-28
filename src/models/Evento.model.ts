import type { Actividad } from "./Actividad.model";
import type { Carrera } from "./Carrera.model";
import type { CategoriaEvento } from "./CategoriaEvento.model";
import type { EventoMaterial } from "./EventoMaterial.model";
import type { EventoMedia } from "./EventoMedia.model";
import type { Media } from "./Media.model";
import type { UnidadAcademica } from "./UnidadAcademica.model";
import { ModeloBase } from "../types/ModeloBase.model";
import type { Asistente } from "./Asistente.model";

export class Evento extends ModeloBase {
  idUnidadAcademica?: string;
  idCategoriaEvento?: string;
  idActividad?: string;
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
  fechaCancelacion?: string;
  visibilidad?: string;

  asistentes?: Asistente[];
  eventoMaterial?: EventoMaterial[];
  eventoMedia?: EventoMedia[];
  carrera?: Carrera;
  actividad?: Actividad;
  categoriaEvento?: CategoriaEvento;
  imagenDestacada?: Media;
  unidadAcademica?: UnidadAcademica;

  static CLASS_NAME = "Evento";
  static BASE_ROUTE = "/eventos";

  static ENDPOINTS = {
    DEFAULT: "api/evento.json",
  };

  static EXPAND = {
    DEFAULT: "carrera,categoriaEvento,imagenDestacada,unidadAcademica,qr,eventoMaterials,actividad,eventoMedia,asistentes",
  };

  static fromJson(data: Partial<Evento>) {
    return new Evento(data);
  }

  static fromJsonList(data: Partial<Evento>[]) {
    return data.map((_data) => new Evento(_data));
  }

  constructor(data: Partial<Evento> = {}) {
    super(data);
  }
}
