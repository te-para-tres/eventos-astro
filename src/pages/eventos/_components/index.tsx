import { useState, useEffect, useMemo, useCallback } from "react";
import { http } from "@/hooks/http";
import { Evento } from "@/models/Evento.model";
import { UnidadAcademica } from "@/models/UnidadAcademica.model";
import { CategoriaEvento } from "@/models/CategoriaEvento.model";
import { Actividad } from "@/models/Actividad.model";
import QuerySelector from "@/components/QuerySelector";
import EventCard from "@/components/EventCard";
import DatePicker from "@/components/DatePicker";
import Paginacion from "@/components/Paginacion";
import EventosCalendario from "@/components/EventosCalendario";
import { Spinner } from "@/components/ui/spinner";
import { CalendarX, Paintbrush } from "lucide-react";


interface Paginacion {
  total: number,
  pagina: number,
  limite: number,
}

const EventosView: React.FC = () => {
  const [unidadAcademica, setUnidadAcademica] = useState("");
  const [categoria, setCategoria] = useState("");
  const [actividad, setActividad] = useState("");
  const [fecha, setFecha] = useState("");
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [paginacion, setPaginacion] = useState<Paginacion | null>();
  const LIMITE = 20;

  const parametros = useMemo(() => ({
    idCategoria: categoria,
    estado: "activo",
    idUnidadAcademica: unidadAcademica,
    idActividad: actividad,
    fecha,
    pagina,
    expand: Evento.EXPAND.DEFAULT,
    limite: LIMITE,
  }), [categoria, pagina, fecha, actividad, unidadAcademica])

  const obtenerEventos = useCallback(async () => {
    try {
      setLoading(true)

      const response = await http.get<Evento[]>(Evento.ENDPOINTS.DEFAULT, parametros);

      if (response.status === 200 && Array.isArray(response.resultado)) {
        setEventos(response.resultado);
        setPaginacion(response.paginacion)
      }

    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }, [parametros]);
  
  const total = paginacion?.total ?? 0;

  const limpiar = () => {
    setUnidadAcademica("");
    setCategoria("");
    setActividad("");
    setFecha("");
  };

  useEffect(() => {
    obtenerEventos();
  }, [obtenerEventos]);

  useEffect(() => {
    setPagina(1);
  }, [unidadAcademica, categoria, actividad, fecha]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">
          Eventos de la <span className="text-primary">Universidad</span>
        </h1>
        <p className="text-text-muted max-w-2xl">
          Conferencias, talleres, actividades culturales y deportivas de todos los
          campus y departamentos de la Universidad Estatal de Sonora. Filtra por
          unidad académica, categoría o fecha y descubre a qué unirte esta semana.
        </p>
      </div>

      <section className="w-full bg-bg-card border border-border-custom rounded-xl p-6 mb-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold capitalize text-primary">
              Campus
            </label>
            <QuerySelector<UnidadAcademica>
              endpoint={UnidadAcademica.ENDPOINTS.DEFAULT}
              placeholder="Todos los unidadAcademica"
              value={unidadAcademica}
              onValueChange={setUnidadAcademica}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold capitalize text-primary">
              Categoría
            </label>
            <QuerySelector<CategoriaEvento>
              endpoint={CategoriaEvento.ENDPOINTS.DEFAULT}
              placeholder="Todas las categorías"
              value={categoria}
              onValueChange={setCategoria}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold capitalize text-primary">
              Actividad
            </label>
            <QuerySelector<Actividad>
              endpoint={Actividad.ENDPOINTS.DEFAULT}
              placeholder="Todas las actividades"
              value={actividad}
              onValueChange={setActividad}
            />
          </div>

          <DatePicker value={fecha} disabled={loading} onChange={setFecha} />

          <div className="flex gap-2 items-end">
            <button
              onClick={limpiar}
              aria-label="Limpiar filtros"
              className="group h-9 px-3 text-sm rounded-lg bg-primary hover:bg-primary-hover flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Paintbrush className="w-4 h-4 text-text-light/80 group-hover:text-text-light transition-colors" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-24 text-gray-400">
          <Spinner />
        </div>
      ) : eventos.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-gray-400 gap-3">
          <CalendarX className="w-10 h-10" aria-hidden="true" />
          <p className="text-sm">No se encontraron resultados.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eventos.map((evento) => (
              <EventCard key={evento.id} event={evento} />
            ))}
          </div>

          <Paginacion
            pagina={pagina}
            total={total}
            limite={LIMITE}
            onPageChange={setPagina}
            etiqueta="eventos"
          />
        </>
      )}
      <EventosCalendario />
    </div>
  );
}

export default EventosView;