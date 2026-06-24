import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { RegistroEventoFormData } from "@/schemas/registroEventoSchema";
import { RegistroEventoSchema } from "@/schemas/registroEventoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { navigate } from "astro:transitions/client";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Evento } from "@/models/Evento.model";
import { toast } from "sonner";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { z } from "astro:content";
import { API_URL, http } from "@/hooks/http";

dayjs.locale("es");

const formatFecha = (fecha?: string) => {
  if (!fecha) return "";
  return dayjs(fecha).format("D MMM YYYY, h:mm A");
};

const RegistroEventoView: React.FC = () => {
  const [evento, setEvento] = useState<Evento| null>();
  const [registrado, setRegistrado] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const id = new URLSearchParams(window.location.search).get("id");

  const form = useForm<z.infer<typeof RegistroEventoSchema>>({
    resolver: zodResolver(RegistroEventoSchema),
    defaultValues: {
      carrera: "",
      expediente: "",
      nombre: "",
    }
  });

  const getEvento = useCallback(async () => {
    setCargando(true);
    try {
      const params = {
        id: id,
        expand: Evento.EXPAND.DEFAULT
      }

      const res = await http.get(Evento.ENDPOINTS.DEFAULT, params);

      if (res.status !== 200) {
        toast.error("No se pudo obtener la informacion del evento");
        return;
      }

      const data = res.resultado as Evento[];
      if (data && data.length > 0) {
        setEvento(data[0]);
      }

    } catch {
      toast.error("Ocurrio un problema al obtener el evento");
    } finally {
      setCargando(false);
    }
  }, []);

  const onFinish = useCallback(async (values: RegistroEventoFormData) => {
    setCargando(true);
    try {
      const body = {
        ...values,
        idEvento: id,
      };

      const res = await http.post("api/asistente.json", body);

      if (res.status !== 200) {
        toast.error(res.mensaje || "Ocurrio un problema al registrarse al evento");
        return;
      }

      toast.success("Te has registrado exitosamente al evento");
      setRegistrado(true);
    } catch {
      toast.error("Ocurrio un problema al registrarse al evento");
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getEvento();
    }
  }, [id, getEvento]);

  return (
    <div className="flex justify-center items-center w-full min-h-screen mx-auto px-4 md:px-6">
      <div className="max-w-5xl bg-white border md:border-2 border-gray-200 md:border-primary rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all">
        <div className="md:w-5/12 bg-gray-50 relative flex flex-col">
          <div className="h-48 md:h-64 relative overflow-hidden shrink-0">
            <img
              src={`${API_URL}recursos/${evento?.imagenDestacada?.ruta}`}
              alt={evento?.nombre}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded shadow-sm">
                {evento?.categoriaEvento?.nombre}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col grow">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-4 leading-tight">
              {evento?.nombre}
            </h2>

            <div className="flex flex-col gap-4 text-gray-600 mt-2">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-clock text-primary mt-1"></i>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">Fecha y Hora</p>
                  <p className="text-sm">
                    {evento?.fechaFin
                      ? `Desde ${formatFecha(evento.fechaInicio)} hasta ${formatFecha(evento.fechaFin)}`
                      : formatFecha(evento?.fechaInicio)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot text-primary mt-1"></i>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">Ubicacion</p>
                  <p className="text-sm">{evento?.lugar}</p>
                  <p className="text-sm text-gray-500">{evento?.unidadAcademica?.nombre}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 mt-auto">
              <p className="text-xs md:text-sm text-gray-500 italic">
                Al registrarte a este evento, aseguras tu lugar y recibiras un recordatorio antes de que comience.
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-7/12 p-6 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold mb-2 text-gray-800">
              Registro al Evento
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Completa la siguiente informacion para confirmar tu asistencia.
            </p>
          </div>

          {registrado ? (
            <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-800 p-8 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in shadow-sm">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg transform transition-transform hover:scale-110">
                <i className="fa-solid fa-check"></i>
              </div>
              <h4 className="text-2xl font-bold mb-2">Registro Exitoso!</h4>
              <p className="text-emerald-700 text-sm md:text-base">
                Tu lugar ha sido reservado. Te hemos enviado un correo de confirmacion con los detalles.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="mt-6 px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition cursor-pointer shadow-md"
              >
                Volver al Inicio
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onFinish)}>
              <FieldSet>
                <FieldGroup className="flex flex-col gap-5 md:gap-6">
                  <Controller
                    name="expediente"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="gap-2" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="expediente" required>
                          Expediente
                        </FieldLabel>
                        <Input
                          {...field}
                          id="expediente"
                          type="text"
                          inputMode="numeric"
                          maxLength={11}
                          placeholder="Ej. 202300001"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError>{fieldState.error?.message}</FieldError>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="nombre"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="gap-2" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="nombre" required>
                          Nombre Completo
                        </FieldLabel>
                        <Input
                          {...field}
                          id="nombre"
                          placeholder="Ej. Juan Perez"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError>{fieldState.error?.message}</FieldError>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="carrera"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="gap-2" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="carrera" required>
                          Carrera
                        </FieldLabel>
                        <Input
                          {...field}
                          id="carrera"
                          placeholder="Ej. Ingenieria de Software"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError>{fieldState.error?.message}</FieldError>
                        )}
                      </Field>
                    )}
                  />

                  <Field className="col-span-full">
                    <Button
                      type="submit"
                      disabled={cargando}
                      className="w-full"
                    >
                      {cargando ? "Registrando..." : "Aceptar y Registrarse"}
                    </Button>
                  </Field>

                </FieldGroup>
              </FieldSet>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default RegistroEventoView;
