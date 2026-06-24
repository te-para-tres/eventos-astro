import type { EventoMaterial } from "./EventoMaterial.model";
import { ModeloBase } from "../types/ModeloBase.model";

export class Material extends ModeloBase {
  nombre?: string;
  descripcion?: string;
  estado?: string;
  cantidad?: number;
  nota?: string;
  eventoMaterial?: EventoMaterial[];

  static CLASS_NAME = "Material";
  static BASE_ROUTE = "/materiales";

  static ENDPOINTS = {
    DEFAULT: "api/materiales.json",
  };

  static EXPAND = {
    DEFAULT: "",
    EVENTO_MATERIAL: "eventoMaterial",
  };

  static fromJson(data: Partial<Material>) {
    return new Material(data);
  }

  static fromJsonList(data: Partial<Material>[]) {
    return data.map((_data) => new Material(_data));
  }

  constructor(data: Partial<Material> = {}) {
    super(data);
  }
}
