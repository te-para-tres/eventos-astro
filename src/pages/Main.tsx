import { useState, useEffect, useCallback } from "react";
import { API_URL, http } from "../hooks/http";
import { Evento as EventoModel } from "../models/Evento.model";
import { Actividad as ActividadModel } from "../models/Actividad.model";
import type { CategoriaResponseItem, UnidadAcademicaResponseItem } from "@/types/catalogos";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationEllipsis, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import EventosCalendario from "@/components/EventosCalendario";

const TODO_CAMPUS = "Todos los Campuses";
const TODO_CATEGORIA = "Todas las Categorías";
const TODO_ACTIVIDAD = "Todas las Actividades";
const CATEGORIA_ENDPOINT = "api/categoria-evento.json";
const UNIDAD_ACADEMICA_ENDPOINT = "api/unidad-academica.json";
const EVENTO_ENDPOINT = EventoModel.ENDPOINTS.DEFAULT;
const ACTIVIDAD_ENDPOINT = ActividadModel.ENDPOINTS.DEFAULT;

function formatDateLabel(fechaInicio?: string, fechaFin?: string): string {
  if (!fechaInicio) return "";
  const inicio = new Date(fechaInicio);
  const dia = inicio.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
  const horaInicio = inicio.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  if (!fechaFin) return `${dia}, ${horaInicio}`;
  const fin = new Date(fechaFin);
  const horaFin = fin.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  return `${dia}, ${horaInicio} – ${horaFin}`;
}

function EventCard({ event }: { event: EventoModel }) {
  const lugares = event.capacidadMaxima ?? 0;
  const esLimitado = lugares > 0 && lugares <= 10;
  const availability = esLimitado
    ? `Limitado: ${lugares} libres`
    : `${lugares > 0 ? lugares + "+" : "Sin límite de"} lugares disponibles`;
  const availabilityBg = esLimitado ? "bg-orange-500" : "bg-emerald-500";

  return (
    <div
      onClick={() => (window.location.href = `${EventoModel.BASE_ROUTE}?id=${event.id}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition hover:shadow-xl hover:-translate-y-1 group cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.imagenDestacada?.ruta ? `${API_URL}/recursos${event.imagenDestacada.ruta}` : undefined}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded">
            {event.categoriaEvento?.nombre}
          </span>
          <span className={`px-3 py-1 text-xs font-bold text-white rounded ${availabilityBg}`}>
            {availability}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col grow">
        <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
          {event.nombre}
        </h3>
        <div className="flex flex-col gap-2 text-sm text-gray-500 mt-auto">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-primary"></i>
            {formatDateLabel(event.fechaInicio, event.fechaFin)}
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-primary"></i>
            {event.lugar ?? event.unidadAcademica?.nombre}
          </div>
        </div>
      </div>
    </div>
  );
}

type DateFilterPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function DateFilterPicker({ value, onChange, disabled = false }: DateFilterPickerProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/25">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Fecha
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-semibold text-primary transition-all duration-300 hover:text-primary-hover cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <i className="fa-regular fa-calendar text-primary"></i>
        <input
          type="date"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  );
}

const ITEMS_POR_PAGINA = 8;

export default function EventosPage() {
  const [campus, setCampus] = useState(TODO_CAMPUS);
  const [categoria, setCategoria] = useState(TODO_CATEGORIA);
  const [actividad, setActividad] = useState(TODO_ACTIVIDAD);
  const [fecha, setFecha] = useState("");
  const [eventosApi, setEventosApi] = useState<EventoModel[]>([]);
  const [resultados, setResultados] = useState<EventoModel[]>([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoriasApi, setCategoriasApi] = useState<CategoriaResponseItem[]>([]);
  const [unidadesAcademicasApi, setUnidadesAcademicasApi] = useState<UnidadAcademicaResponseItem[]>([]);
  const [actividadesApi, setActividadesApi] = useState<ActividadModel[]>([]);

  const totalPaginas = Math.ceil(resultados.length / ITEMS_POR_PAGINA);
  const eventosPagina = resultados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );
  const desde = resultados.length === 0 ? 0 : (pagina - 1) * ITEMS_POR_PAGINA + 1;
  const hasta = Math.min(pagina * ITEMS_POR_PAGINA, resultados.length);

  const obtenerEventos = useCallback(async () => {
    const response = await http.get<EventoModel[]>(
      `${EVENTO_ENDPOINT}?expand=${EventoModel.EXPAND.DEFAULT}`
    );
    if (response.status === 200 && Array.isArray(response.resultado)) {
      setEventosApi(response.resultado);
      setResultados(response.resultado);
    }
  }, []);

  const obtenerCategorias = useCallback(async () => {
    const response = await http.get<CategoriaResponseItem[]>(CATEGORIA_ENDPOINT);
    if (response.status === 200 && Array.isArray(response.resultado)) {
      setCategoriasApi(response.resultado);
    }
  }, []);

  const obtenerUnidadesAcademicas = useCallback(async () => {
    const response = await http.get<UnidadAcademicaResponseItem[]>(UNIDAD_ACADEMICA_ENDPOINT);
    if (response.status === 200 && Array.isArray(response.resultado)) {
      setUnidadesAcademicasApi(response.resultado);
    }
  }, []);

  const obtenerActividades = useCallback(async () => {
    const response = await http.get<ActividadModel[]>(ACTIVIDAD_ENDPOINT);
    if (response.status === 200 && Array.isArray(response.resultado)) {
      setActividadesApi(response.resultado);
    }
  }, []);

  const campusDisponibles =
    unidadesAcademicasApi.length > 0
      ? unidadesAcademicasApi.map((u) => u.nombre)
      : ["Hermosillo", "Navojoa"];

  const categoriasDisponibles =
    categoriasApi.length > 0
      ? categoriasApi.map((c) => c.nombre)
      : ["Feria de Empleo", "Seminario", "Deportes", "Social"];

  const actividadesDisponibles =
    actividadesApi.length > 0
      ? actividadesApi.map((a) => a.nombre)
      : [];

  const filtrar = useCallback(() => {
    const filtrados = eventosApi.filter((e) =>
      (campus === TODO_CAMPUS || e.unidadAcademica?.nombre === campus) &&
      (categoria === TODO_CATEGORIA || e.categoriaEvento?.nombre === categoria) &&
      (actividad === TODO_ACTIVIDAD || e.actividad?.nombre === actividad) &&
      (!fecha || e.fechaInicio?.slice(0, 10) === fecha)
    );
    setResultados(filtrados);
    setPagina(1);
  }, [eventosApi, campus, categoria, actividad, fecha]);

  const limpiar = () => {
    setCampus(TODO_CAMPUS);
    setCategoria(TODO_CATEGORIA);
    setActividad(TODO_ACTIVIDAD);
    setFecha("");
    setResultados(eventosApi);
    setPagina(1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") filtrar();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtrar]);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        await Promise.all([
          obtenerEventos(),
          obtenerCategorias(),
          obtenerUnidadesAcademicas(),
          obtenerActividades(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void cargar();
  }, [obtenerEventos, obtenerCategorias, obtenerUnidadesAcademicas, obtenerActividades]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Próximos Eventos</h1>
        <p className="text-gray-600 max-w-2xl">
          Explora y únete a las actividades y eventos más recientes.
        </p>
      </div>

      <section className="bg-white p-6 mb-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-center">
          <div className="rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/25">
            <label htmlFor="campus-filter" className="mb-1 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Campus
            </label>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-school text-primary"></i>
              <select
                id="campus-filter"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
              >
                <option>{TODO_CAMPUS}</option>
                {campusDisponibles.map((c) => (
                  <option key={c} value={c ?? ""}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/25">
            <label htmlFor="categoria-filter" className="mb-1 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Categoría
            </label>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-shapes text-primary"></i>
              <select
                id="categoria-filter"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
              >
                <option>{TODO_CATEGORIA}</option>
                {categoriasDisponibles.map((c) => (
                  <option key={c} value={c ?? ""}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/25">
            <label htmlFor="actividad-filter" className="mb-1 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Actividad
            </label>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-person-running text-primary"></i>
              <select
                id="actividad-filter"
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
              >
                <option>{TODO_ACTIVIDAD}</option>
                {actividadesDisponibles.map((a) => (
                  <option key={a} value={a ?? ""}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <DateFilterPicker value={fecha} disabled={loading} onChange={setFecha} />

          <div className="flex gap-2 items-end">
            <button
              onClick={limpiar}
              className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-filter-circle-xmark text-xs"></i>
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-24 text-gray-400">
          <i className="fa-solid fa-spinner fa-spin text-3xl"></i>
        </div>
      ) : resultados.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-gray-400 gap-3">
          <i className="fa-solid fa-calendar-xmark text-4xl"></i>
          <p className="text-sm">No se encontraron eventos con los filtros seleccionados.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eventosPagina.map((evento) => (
              <EventCard key={evento.id} event={evento} />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (pagina > 1) {
                        setPagina(pagina - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={pagina === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                  />
                </PaginationItem>

                {(() => {
                  const paginas: (number | "...")[] = [];
                  if (totalPaginas <= 7) {
                    for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
                  } else {
                    paginas.push(1);
                    if (pagina > 3) paginas.push("...");
                    const desde = Math.max(2, pagina - 1);
                    const hasta = Math.min(totalPaginas - 1, pagina + 1);
                    for (let i = desde; i <= hasta; i++) paginas.push(i);
                    if (pagina < totalPaginas - 2) paginas.push("...");
                    paginas.push(totalPaginas);
                  }

                  return paginas.map((p, i) =>
                    p === "..." ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === pagina}
                          onClick={() => {
                            setPagina(p as number);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  );
                })()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (pagina < totalPaginas) {
                        setPagina(pagina + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={pagina === totalPaginas ? "pointer-events-none opacity-40" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-sm text-gray-400">
              Mostrando {desde}–{hasta} de {resultados.length} eventos
            </p>
          </div>
        </>
      )}
      <EventosCalendario />
    </div>
  );
}