import { useState, useEffect, useCallback } from "react";
import { http } from "../hooks/http";
import type {
  CategoriaResponseItem,
  UnidadAcademicaResponseItem,
} from "../models/catalogos.model.ts";

type AvailabilityColor = "emerald" | "amber";

type Evento = {
  title: string;
  category: string;
  date: string;
  dateLabel: string;
  location: string;
  image: string;
  availability: string;
  availabilityColor: AvailabilityColor;
  campus: string;
};

const eventosData: Evento[] = [
  {
    title: "IA en Ética: Un Seminario Profundo",
    category: "Seminario",
    date: "2026-10-12",
    dateLabel: "12 Oct, 2:00 PM – 4:00 PM",
    location: "Campus Hermosillo, Aula 402",
    campus: "Hermosillo",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw9OQKmd4EtyO4PfgSh2D5OLffvTN1dkZ0Xplq1rCO7NflOMdKJkzneOOvIi843e309t4I4LpIuuI0kF5D-oiLSWJqPyJ2NK8x8FfhZW3idaLhLRjo1GvbqhNc9ULX-GR5M7qY0vK5bg-IcafsnuteoyMZEvF60O2cVN66U-lCb3_XeMmy5hWk64Jp3VDAn3hi6vTNlYNFt2zsnXbO_gHXWQd8byLs7n83ZpB8KN1dQ4-cgSDLMsmDuv4VWQYDO2l0QjiFXavZ-g",
    availability: "15 Lugares disponibles",
    availabilityColor: "emerald",
  },
  {
    title: "IA en Ética: Un Seminario Profundo (Extra)",
    category: "Seminario",
    date: "2026-10-12",
    dateLabel: "12 Oct, 2:00 PM – 4:00 PM",
    location: "Campus Hermosillo, Aula 402",
    campus: "Hermosillo",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw9OQKmd4EtyO4PfgSh2D5OLffvTN1dkZ0Xplq1rCO7NflOMdKJkzneOOvIi843e309t4I4LpIuuI0kF5D-oiLSWJqPyJ2NK8x8FfhZW3idaLhLRjo1GvbqhNc9ULX-GR5M7qY0vK5bg-IcafsnuteoyMZEvF60O2cVN66U-lCb3_XeMmy5hWk64Jp3VDAn3hi6vTNlYNFt2zsnXbO_gHXWQd8byLs7n83ZpB8KN1dQ4-cgSDLMsmDuv4VWQYDO2l0QjiFXavZ-g",
    availability: "15 Lugares disponibles",
    availabilityColor: "emerald",
  },
  {
    title: "Final Anual de Basquetbol UES",
    category: "Deportes",
    date: "2026-10-15",
    dateLabel: "15 Oct, 6:00 PM",
    location: "Complejo Deportivo",
    campus: "Hermosillo",
    image: "/img/image.png",
    availability: "50+ Lugares disponibles",
    availabilityColor: "emerald",
  },
  {
    title: "Tech Connect: Feria de Empleo Otoño",
    category: "Feria de Empleo",
    date: "2026-10-18",
    dateLabel: "18 Oct, 10:00 AM – 4:00 PM",
    location: "Campus Navojoa, Sala de Exposiciones",
    campus: "Navojoa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj2tWOnL1OeSM0aCK8tIk9-YKWcTSQTWUO7E0-mwqeAZ9ik7C1ESM7LbyPKpK_9fNoHbsMnVF_RJQU2v-xCnzMJBTvD09_IzcpSZnaHDSVS7KD6Nu0CSvV_isYpUbe97Y-KFGff34uBcMx22a9ATyHgaduUFA3rjAm_5mjLuo5DSfKv3V9F8bCC4FZKLbXx2lQDx3VFJCxcG939bdxTn4qrbTpBEhUvP34AS4hhw-WJskFA_HiVP2PrnlM63OmcGr-MLtE4mViGg",
    availability: "Limitado: 8 libres",
    availabilityColor: "amber",
  },
  {
    title: "Convivencia de Graduados: Noche Social",
    category: "Social",
    date: "2026-10-20",
    dateLabel: "20 Oct, 7:30 PM",
    location: "Centro de Estudiantes",
    campus: "Hermosillo",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnjK_isGZD8ZdqR-Rrdyd6uPPCFPUY8HFoELe8JBEt8etwLsniUJV2-QZXy-K6ld3cjcFpnK5hDDc5OaQbB6nprfPVneQOxz22tnrmzpV_8R5N3R1aa20Mi2cQA3Wc3_oKDZvWKGwp4M3mCMaAd82VJ-XLq4-TzsS4wii9Ss5ZKx8XfWBYAO-mTPt5d62seq0dbJg3YYtbsSVPKx-RJFUrFUtvBGhLG9Jn7o5XuSPSMmFWo_o15s4zHjzvsDqc6sGdQ-3fRR5JCA",
    availability: "100+ Lugares disponibles",
    availabilityColor: "emerald",
  },
];

const TODO_CAMPUS = "Todos los Campuses";
const TODO_CATEGORIA = "Todas las Categorías";
const CATEGORIA_ENDPOINT = "api/categoria-evento.json";
const UNIDAD_ACADEMICA_ENDPOINT = "api/unidad-academica.json";


function EventCard({ event }: { event: Evento }) {
  const availabilityBg =
    event.availabilityColor === "emerald"
      ? "bg-emerald-500"
      : "bg-orange-500";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition hover:shadow-xl hover:-translate-y-1 group">

      <div className="relative h-52 overflow-hidden">
        <img
          src={event.image}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded">
            {event.category}
          </span>

          <span className={`px-3 py-1 text-xs font-bold text-white rounded ${availabilityBg}`}>
            {event.availability}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col grow">
        <h3 className="text-lg font-bold mb-3 group-hover:text-primary">
          {event.title}
        </h3>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-primary"></i>
            {event.dateLabel}
          </div>

          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-primary"></i>
            {event.location}
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
  const [resultados, setResultados] = useState(eventosData);
  const [visible, setVisible] = useState(4);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);
  const [categoriasApi, setCategoriasApi] = useState<CategoriaResponseItem[]>([]);
  const [unidadesAcademicasApi, setUnidadesAcademicasApi] = useState<
    UnidadAcademicaResponseItem[]
  >([]);

  const obtenerCategorias = useCallback(async () => {
    try {
      const response = await http.get<CategoriaResponseItem[]>(CATEGORIA_ENDPOINT);
      if (response.status === 200 && Array.isArray(response.resultado)) {
        setCategoriasApi(response.resultado);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const obtenerUnidadesAcademicas = useCallback(async () => {
    try {
      const response = await http.get<UnidadAcademicaResponseItem[]>(
        UNIDAD_ACADEMICA_ENDPOINT
      );
      if (response.status === 200 && Array.isArray(response.resultado)) {
        setUnidadesAcademicasApi(response.resultado);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const campusDisponibles =
    unidadesAcademicasApi.length > 0
      ? unidadesAcademicasApi.map((unidad) => unidad.nombre)
      : ["Hermosillo", "Navojoa"];

  const categoriasDisponibles =
    categoriasApi.length > 0
      ? categoriasApi.map((cat) => cat.nombre)
      : ["Feria de Empleo", "Seminario", "Deportes", "Social"];

  const filtrar = () => {
    const filtrados = eventosData.filter((e) =>
      (campus === TODO_CAMPUS || e.campus === campus) &&
      (categoria === TODO_CATEGORIA || e.category === categoria) &&
      (!fecha || e.date === fecha)
    );

    setResultados(filtrados);
    setVisible(4);
  };

  const limpiar = () => {
    setCampus(TODO_CAMPUS);
    setCategoria(TODO_CATEGORIA);
    setFecha("");
    setResultados(eventosData);
    setVisible(4);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") filtrar();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [campus, categoria, fecha]);

  useEffect(() => {
    const cargarCatalogos = async () => {
      setLoadingCatalogos(true);
      console.log("Cargando catálogos...");
      await Promise.all([obtenerCategorias(), obtenerUnidadesAcademicas()]);
      setLoadingCatalogos(false);
    };

    void cargarCatalogos();
  }, [obtenerCategorias, obtenerUnidadesAcademicas]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">
          Próximos Eventos
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Explora y únete a las actividades y eventos más recientes.
        </p>
      </div>

      <section className="bg-white border-2 border-primary rounded-xl shadow-sm p-6 mb-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/25">
            <label
              htmlFor="campus-filter"
              className="mb-1 block text-xs font-semibold tracking-wide text-gray-500 uppercase"
            >
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
                {campusDisponibles.map((campusItem) => (
                  <option key={campusItem} value={campusItem ?? ""}>
                    {campusItem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/25">
            <label
              htmlFor="categoria-filter"
              className="mb-1 block text-xs font-semibold tracking-wide text-gray-500 uppercase"
            >
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
                {categoriasDisponibles.map((categoriaItem) => (
                  <option key={categoriaItem} value={categoriaItem ?? ""}>
                    {categoriaItem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DateFilterPicker
            value={fecha}
            disabled={loadingCatalogos}
            onChange={setFecha}
          />

          <div className="flex gap-2">
            <button onClick={filtrar}
              disabled={loadingCatalogos}
              className="w-full bg-primary text-white rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed">
              Buscar
            </button>

            <button onClick={limpiar}
              disabled={loadingCatalogos}
              className="w-full bg-gray-100 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-300 disabled:opacity-60 disabled:cursor-not-allowed">
              Limpiar
            </button>
          </div>

        </div>
      </section>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resultados.slice(0, visible).map((evento, i) => (
          <EventCard key={i} event={evento} />
        ))}
      </div>

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

        <p className="text-sm text-gray-500">
          Mostrando {Math.min(visible, resultados.length)} de {resultados.length}
        </p>
      </div>

    </div>
  );
}