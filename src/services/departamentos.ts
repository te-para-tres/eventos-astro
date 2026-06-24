import { http } from "@/hooks/http";
import { Carrera } from "@/models/Carrera.model";

export async function getCarreras(
  parametros: Record<string, any> = {},
): Promise<Carrera[]> {
  try {
    const res = await http.get(Carrera.ENDPOINTS.DEFAULT, { ...parametros });

    if (res.isError || !res.resultado) {
      console.error("Ocurrió un error al obtener carreras");
      return [];
    }

    return Carrera.fromJsonList(res.resultado as []);
  } catch (error) {
    console.log("Ocurrió un error al obtener carreras", error);
    return [];
  }
}
