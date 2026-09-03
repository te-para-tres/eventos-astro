import type { UnidadAcademica } from "./UnidadAcademica.model";
import { ModeloBase } from "../types/ModeloBase.model";
import type { Carrera } from "./Carrera.model";

export class UsuarioPublico extends ModeloBase {
  idCarrera?: string;
  idUnidadAcademica?: string;
  idFoto?: string;
  expediente?: string;
  nombre?: string;
  apellidos?: string;
  correo?: string;
  clave?: string;
  estatus?: number;
  telefono?: string;
  descripcion?: string;

  carrera?: Carrera;
  unidadAcademica?: UnidadAcademica;

  static CLASS_NAME = "Usuario Público";
  static BASE_ROUTE = "/";

  static ENDPOINTS = {
    DEFAULT: "api/usuario-publico.json",
  };

  static EXPAND = {
    DEFAULT: "unidadAcademica,carrera",
  };

  static fromJson(data: Partial<UsuarioPublico>) {
    return new UsuarioPublico(data);
  }

  static fromJsonList(data: Partial<UsuarioPublico>[]) {
    return data.map((_data) => new UsuarioPublico(_data));
  }

  constructor(data: Partial<UsuarioPublico> = {}) {
    super(data);
  }
}
