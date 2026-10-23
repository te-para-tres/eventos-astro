import { ModeloBase } from "../types/ModeloBase.model";
import type { Carrera } from "./Carrera.model";
import type { UnidadAcademica } from "./UnidadAcademica.model";

export class Estudiante extends ModeloBase {
  idUnidadAcademica?: string;
  idCarrera?: string;
  idMedia?: string;
  expediente?: string;
  correo?: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  estatus?: number;
  unidadAcademica?: UnidadAcademica;
  carrera?: Carrera;

  static CLASS_NAME = "Estudiante";
  static BASE_ROUTE = "/perfil";

  static ENDPOINTS = {
    DEFAULT: "api/estudiante.json",
    REGISTRO: "api/registro.json",
    INICIAR_SESION: "api/iniciar-sesion.json",
    REFRESCAR_TOKEN: "api/refrescar-token.json",
    CERRAR_SESION: "api/cerrar-sesion.json",
  };

  static EXPAND = {
    DEFAULT: "unidadAcademica,carrera",
  };

  static fromJson(data: Partial<Estudiante>) {
    return new Estudiante(data);
  }

  static fromJsonList(data: Partial<Estudiante>[]) {
    return data.map((_data) => new Estudiante(_data));
  }

  constructor(data: Partial<Estudiante> = {}) {
    super(data);
  }
}
