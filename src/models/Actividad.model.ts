export class Actividad {
  id?: string;
  clave?: string;
  nombre?: string;
  descripcion?: string;
  creado?: string;
  modificado?: string;
  eliminado?: string;

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
    Object.assign(this, data);
  }
}