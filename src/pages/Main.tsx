import { useState, useEffect, useCallback } from "react";
import { http } from "../hooks/http";
import { Evento as EventoModel } from "../models/Evento.model";
import type { CategoriaResponseItem, UnidadAcademicaResponseItem } from "@/types/catalogos";

const TODO_CAMPUS = "Todos los Campuses";
const TODO_CATEGORIA = "Todas las Categorías";
const CATEGORIA_ENDPOINT = "api/categoria-evento.json";
const UNIDAD_ACADEMICA_ENDPOINT = "api/unidad-academica.json";
const EVENTO_ENDPOINT = EventoModel.ENDPOINTS.DEFAULT;

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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition hover:shadow-xl hover:-translate-y-1 group">
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.imagenDestacada?.ruta ?? "/img/image.png"}
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
        <h3 className="text-lg font-bold mb-3 group-hover:text-primary">
          {event.nombre}
        </h3>
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-primary"></i>
            {formatDateLabel(event.fechaInicio, event.fechaFin)}
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-primary"></i>
            {event.lugar ?? event.unidadAcademica?.nombre}
          </div>
        </div>
        <button
          onClick={() => (window.location.href = "/eventos")}
          className="mt-6 w-full p-2.5 border-2 border-primary text-primary rounded-lg font-bold transition hover:bg-primary hover:text-white cursor-pointer"
        >
          Ver Detalles
        </button>
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

export default function EventosPage() {
  const [campus, setCampus] = useState(TODO_CAMPUS);
  const [categoria, setCategoria] = useState(TODO_CATEGORIA);
  const [fecha, setFecha] = useState("");
  const [eventosApi, setEventosApi] = useState<EventoModel[]>([]);
  const [resultados, setResultados] = useState<EventoModel[]>([]);
  const [visible, setVisible] = useState(4);
  const [loading, setLoading] = useState(false);
  const [categoriasApi, setCategoriasApi] = useState<CategoriaResponseItem[]>([]);
  const [unidadesAcademicasApi, setUnidadesAcademicasApi] = useState<UnidadAcademicaResponseItem[]>([]);

  const obtenerEventos = useCallback(async () => {
    const response = await http.get<EventoModel[]>(EVENTO_ENDPOINT);
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

  const campusDisponibles =
    unidadesAcademicasApi.length > 0
      ? unidadesAcademicasApi.map((u) => u.nombre)
      : ["Hermosillo", "Navojoa"];

  const categoriasDisponibles =
    categoriasApi.length > 0
      ? categoriasApi.map((c) => c.nombre)
      : ["Feria de Empleo", "Seminario", "Deportes", "Social"];

  const filtrar = useCallback(() => {
    const filtrados = eventosApi.filter((e) =>
      (campus === TODO_CAMPUS || e.unidadAcademica?.nombre === campus) &&
      (categoria === TODO_CATEGORIA || e.categoriaEvento?.nombre === categoria) &&
      (!fecha || e.fechaInicio?.slice(0, 10) === fecha)
    );
    setResultados(filtrados);
    setVisible(4);
  }, [eventosApi, campus, categoria, fecha]);

  const limpiar = () => {
    setCampus(TODO_CAMPUS);
    setCategoria(TODO_CATEGORIA);
    setFecha("");
    setResultados(eventosApi);
    setVisible(4);
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
        await Promise.all([obtenerEventos(), obtenerCategorias(), obtenerUnidadesAcademicas()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void cargar();
  }, [obtenerEventos, obtenerCategorias, obtenerUnidadesAcademicas]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Próximos Eventos</h1>
        <p className="text-gray-600 max-w-2xl">
          Explora y únete a las actividades y eventos más recientes.
        </p>
      </div>

      <section className="bg-white p-6 mb-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-center">
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resultados.slice(0, visible).map((evento, i) => (
            <EventCard key={evento.id ?? i} event={evento} />
          ))}
        </div>
      )}

      <div className="mt-16 flex flex-col items-center gap-4">
        {visible < resultados.length && (
          <button
            onClick={() => setVisible((prev) => prev + 4)}
            className="border-2 border-primary text-primary px-8 py-3 rounded-xl hover:bg-primary hover:text-white cursor-pointer transition-all"
          >
            Cargar más eventos
          </button>
        )}
        {visible > 4 && (
          <button
            onClick={() => setVisible((prev) => Math.max(4, prev - 4))}
            className="border-2 border-primary text-primary px-8 py-3 rounded-xl hover:bg-primary hover:text-white cursor-pointer transition-all"
          >
            Mostrar menos
          </button>
        )}
        {!loading && (
          <p className="text-sm text-gray-500">
            Mostrando {Math.min(visible, resultados.length)} de {resultados.length}
          </p>
        )}
      </div>
    </div>
  );
}