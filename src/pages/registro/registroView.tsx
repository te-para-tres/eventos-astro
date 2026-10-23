import { zodResolver } from "@hookform/resolvers/zod";
import { navigate } from "astro:transitions/client";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import CampoTexto from "@/components/CampoTexto";
import QuerySelector from "@/components/QuerySelector";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Carrera } from "@/models/Carrera.model";
import { UnidadAcademica } from "@/models/UnidadAcademica.model";
import { RegistroSchema, type RegistroFormData } from "@/schemas/registro.schema";

const RegistroView: React.FC = () => {
  const { registrar } = useAuth();

  const form = useForm<RegistroFormData>({
    resolver: zodResolver(RegistroSchema),
    defaultValues: {
      expediente: "",
      nombre: "",
      apellidos: "",
      correo: "",
      telefono: "",
      idUnidadAcademica: "",
      idCarrera: "",
      clave: "",
      confirmarClave: "",
    },
  });
  const idUnidadAcademica = useWatch({ control: form.control, name: "idUnidadAcademica" });

  const onFinish = async (values: RegistroFormData) => {
    try {
      const res = await registrar(values);

      if (res.isError) {
        Object.entries(res.errores ?? {}).forEach(([campo, mensaje]) =>
          form.setError(campo as keyof RegistroFormData, { message: String(mensaje) }),
        );
        toast.error(res.mensaje || "No se pudo crear la cuenta");
        return;
      }

      toast.success("¡Cuenta creada! Ya puedes inscribirte a los eventos");
      navigate("/eventos");
    } catch {
      toast.error("Ocurrió un problema al crear la cuenta");
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="grid min-h-[calc(100vh-100px)] grid-cols-1 lg:grid-cols-[45%_55%]">
      <section className="relative flex min-h-[260px] flex-col justify-end overflow-hidden bg-primary px-10 py-14 md:px-14 md:py-20 lg:min-h-0">
        <div className="pointer-events-none absolute -top-20 -right-20 size-88 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -top-8 -right-8 size-56 rounded-full border border-white/5" />

        <div className="relative z-10 max-w-[36ch]">
          <span className="mb-6 inline-block text-xs font-medium uppercase tracking-widest text-text-light/70">
            Universidad Estatal de Sonora
          </span>
          <h1 className="mb-4 text-[clamp(1.8rem,3vw,2.75rem)] font-extrabold leading-[1.08] tracking-tight text-text-light">
            Crea tu cuenta <br />
            <span className="text-text-light/70">gratis</span>
          </h1>
          <p className="text-sm leading-relaxed text-text-light/80">
            Explora los eventos más relevantes de la Universidad Estatal de Sonora
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-bg-card px-6 py-14 md:px-12 md:py-20">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <p className="mb-3 text-sm text-text-muted">
              ¿Ya tienes una cuenta?{" "}
              <a href="/iniciar-sesion" className="font-semibold text-primary hover:text-primary-hover hover:underline">
                Iniciar sesión
              </a>
            </p>
            <h2 className="text-3xl font-extrabold text-text-main">
              <span className="text-primary">Regístrate</span> como estudiante
            </h2>
          </div>

          <form onSubmit={form.handleSubmit(onFinish)} noValidate className="flex flex-col gap-6">
            <FieldGroup className="grid gap-5 sm:grid-cols-2">
              <CampoTexto control={form.control} name="nombre" label="Nombre" autoComplete="given-name" placeholder="Ej. Ana" required />
              <CampoTexto control={form.control} name="apellidos" label="Apellidos" autoComplete="family-name" placeholder="Ej. López Ruiz" required />
              <CampoTexto
                control={form.control}
                name="expediente"
                label="Expediente"
                inputMode="numeric"
                maxLength={11}
                placeholder="Ej. 21900000001"
                required
              />
              <CampoTexto
                control={form.control}
                name="telefono"
                label="Teléfono"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                placeholder="Ej. 6621234567"
              />
              <div className="sm:col-span-2">
                <CampoTexto
                  control={form.control}
                  name="correo"
                  label="Correo electrónico"
                  type="email"
                  autoComplete="email"
                  placeholder="Ej. ejemplo@ues.mx"
                  required
                />
              </div>

              <Controller
                name="idUnidadAcademica"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="idUnidadAcademica" required>
                      Unidad académica
                    </FieldLabel>
                    <QuerySelector<UnidadAcademica>
                      id={field.name}
                      invalid={fieldState.invalid}
                      className="h-11 bg-bg-main"
                      endpoint={UnidadAcademica.ENDPOINTS.DEFAULT}
                      placeholder="Selecciona una unidad"
                      value={field.value}
                      onValueChange={(id) => {
                        if (id !== field.value) form.resetField("idCarrera");
                        field.onChange(id);
                      }}
                    />
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </Field>
                )}
              />

              <Controller
                name="idCarrera"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="idCarrera" required>
                      Carrera
                    </FieldLabel>
                    <QuerySelector<Carrera>
                      key={idUnidadAcademica}
                      id={field.name}
                      invalid={fieldState.invalid}
                      disabled={!idUnidadAcademica}
                      className="h-11 bg-bg-main"
                      endpoint={Carrera.ENDPOINTS.DEFAULT}
                      queryProps={{ idUnidadAcademica }}
                      placeholder={idUnidadAcademica ? "Selecciona una carrera" : "Elige primero una unidad"}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </Field>
                )}
              />

              <CampoTexto
                control={form.control}
                name="clave"
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                required
              />
              <CampoTexto
                control={form.control}
                name="confirmarClave"
                label="Confirmar contraseña"
                type="password"
                autoComplete="new-password"
                required
              />
            </FieldGroup>

            <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl text-base font-semibold hover:bg-primary-hover">
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default RegistroView;
