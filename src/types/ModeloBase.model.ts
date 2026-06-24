export interface IModeloBase {
  id?: string;

  creado?: string;
  modificado?: string;
  eliminado?: string;

  ENDPOINTS: {
    DEFAULT: string;
    [key: string]: string;
  };

  EXPAND: {
    DEFAULT: string;
    [key: string]: string;
  };
}

export class ModeloBase {
  id?: string;

  creado?: string;
  modificado?: string;
  eliminado?: string;

  //#region STATICS DEFAULT PARA CRUDS
  static BASE_ROUTE = "/";

  static ENDPOINTS = {
    DEFAULT: "/v1/default.json",
  };

  static EXPAND = {
    DEFAULT: "",
  };

  static fromJson(data: Partial<ModeloBase>) {
    return new ModeloBase(data);
  }

  static fromJsonList(data: Partial<ModeloBase>[]) {
    return data.map((_data) => new ModeloBase(_data));
  }

  //#endregion
  protected constructor(data: Partial<ModeloBase> = {}) {
    Object.assign(this, data);
  }
}
