import React, { useState, useEffect, useCallback } from "react";
import { http } from "../../hooks/http";
import type { CarreraResponseItem } from "../../models/catalogos.model";

const CARRERA_ENDPOINT = "api/carrera";

export default function Departamentos() {
  const [carreras, setCarreras] = useState<CarreraResponseItem[]>([]);
  const [loading, setLoading] = useState(false);

  const obtenerCarreras = useCallback(async () => {
    setLoading(true);
    try {
      const response = await http.get<CarreraResponseItem[]>(CARRERA_ENDPOINT);
      if (response.status === 200 && Array.isArray(response.resultado)) {
        setCarreras(response.resultado);
      }
    } catch (error) {
      console.error("Error al obtener carreras:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void obtenerCarreras();
  }, [obtenerCarreras]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold mb-10">Departamentos</h1>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <i className="fa-solid fa-spinner fa-spin text-primary text-3xl"></i>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carreras.map((c) => (
            <div
              key={c.id}
              onClick={() => (window.location.href = `/departamentos/${c.id}`)}
              className="border rounded-xl p-6 hover:shadow-lg transition cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-building"></i>
                </div>
                <div>
                  <h2 className="font-bold group-hover:text-primary">
                    {c.nombre ?? "Sin nombre"}
                  </h2>
                  <p className="text-xs text-gray-500">{c.tipo ?? "—"}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{c.descripcion ?? ""}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}