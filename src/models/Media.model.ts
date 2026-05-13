export class Media {
  id?: string;
  idUsuario?: number;
  nombre?: string;
  uuid?: string;
  peso?: number;
  extension?: string;
  mimetype?: string;
  ruta?: string;
  descripcion?: string;
  creado?: string;
  modificado?: string;

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
    Object.assign(this, data);
  }
}
