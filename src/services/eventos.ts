import { http } from "@/hooks/http";
import { Evento } from "@/models/Evento.model";

export async function getEventos(
  parametros: Record<string, any> = {},
): Promise<Evento[]> {
  try {
    const res = await http.get(Evento.ENDPOINTS.DEFAULT, { ...parametros });

    if (res.isError || !res.resultado) {
      console.error("Ocurrió un error al obtener eventos");
      return [];
    }

    return Evento.fromJsonList(res.resultado as []);
  } catch (error) {
    console.log("Ocurrió un error al obtener eventos", error);
    return [];
  }
}
