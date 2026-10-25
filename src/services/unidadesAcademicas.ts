import { http } from "@/hooks/http";
import { UnidadAcademica } from "@/models/UnidadAcademica.model";

export async function getUnidadesAcademicas(
  parametros: Record<string, any> = {},
): Promise<UnidadAcademica[]> {
  try {
    const res = await http.get(UnidadAcademica.ENDPOINTS.DEFAULT, { ...parametros });

    if (res.isError || !res.resultado) {
      console.error("Ocurrió un error al obtener unidades académicas");
      return [];
    }

    return UnidadAcademica.fromJsonList(res.resultado as []);
  } catch (error) {
    console.log("Ocurrió un error al obtener unidades académicas", error);
    return [];
  }
}