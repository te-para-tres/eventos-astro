import { ModeloBase } from "../types/ModeloBase.model";

export class Media extends ModeloBase {
  idUsuario?: number;
  nombre?: string;
  uuid?: string;
  peso?: number;
  extension?: string;
  mimetype?: string;
  ruta?: string;
  descripcion?: string;

  static CLASS_NAME = "Media";
  static BASE_ROUTE = "/media";

  static ENDPOINTS = {
    DEFAULT: "api/media.json",
  };

  static EXPAND = {
    DEFAULT: "",
  };


  static fromJson(data: Partial<Media>) {
    return new Media(data);
  }

  static fromJsonList(data: Partial<Media>[]) {
    return data.map((_data) => new Media(_data));
  }

  constructor(data: Partial<Media> = {}) {
    super(data);
  }
}
