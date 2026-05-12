export class RegistroEvento {
  id?: string;
  idCarrera?: string;
  idUnidadAcademica?: string;
  idEvento?: string;
  nombre?: string;
  correo?: string;
  expediente?: string;
  carrera?: string;
  telefono?: string;

  static CLASS_NAME = "Registro Evento";
  static BASE_ROUTE = "/registro-evento";

  static ENDPOINTS = {
    DEFAULT: "",
  };

  static EXPAND = {
    DEFAULT: "",
  };

  static fromJson(data: Partial<RegistroEvento>) {
    return new RegistroEvento(data);
  }

  static fromJsonList(data: Partial<RegistroEvento>[]) {
    return data.map((_data) => new RegistroEvento(_data));
  }

  constructor(data: Partial<RegistroEvento> = {}) {
    Object.assign(this, data);
  }
}
