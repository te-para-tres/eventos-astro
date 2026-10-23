import { zodResolver } from "@hookform/resolvers/zod";
import { navigate } from "astro:transitions/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CampoTexto from "@/components/CampoTexto";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { IniciarSesionSchema, type IniciarSesionFormData } from "@/schemas/iniciarSesion.schema";

const IniciarSesionView: React.FC = () => {
  const { iniciarSesion } = useAuth();

  const form = useForm<IniciarSesionFormData>({
    resolver: zodResolver(IniciarSesionSchema),
    defaultValues: { correo: "", clave: "" },
  });

  const onFinish = async (values: IniciarSesionFormData) => {
    try {
      const res = await iniciarSesion(values);

      if (res.isError) {
        Object.entries(res.errores ?? {}).forEach(([campo, mensaje]) =>
          form.setError(campo as keyof IniciarSesionFormData, { message: String(mensaje) }),
        );
        toast.error(res.mensaje || "No se pudo iniciar sesión");
        return;
      }

      toast.success(`¡Hola, ${res.detalle?.nombre}!`);
      navigate("/eventos");
    } catch {
      toast.error("Ocurrió un problema al iniciar sesión");
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="grid w-full min-h-[calc(100vh-100px)] grid-cols-1 md:grid-cols-[minmax(280px,1fr)_minmax(320px,520px)]">
      <section className="flex flex-col justify-center items-start gap-4 bg-primary p-8 md:p-16 text-text-light">
        <span className="text-xs font-medium uppercase tracking-widest text-text-light/70">
          Universidad Estatal de Sonora
        </span>
        <h1 className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-extrabold leading-[1.1] tracking-tight">
          Bienvenido de nuevo
        </h1>
        <p className="max-w-[38ch] leading-relaxed text-text-light/80">
          Inicia sesión para ver y gestionar los eventos de la Universidad Estatal de Sonora
        </p>
      </section>

      <form onSubmit={form.handleSubmit(onFinish)} noValidate className="flex flex-col justify-center gap-6 bg-bg-card p-8 md:p-12">
        <div>
          <p className="mb-2 text-sm text-text-muted">
            ¿Aún no tienes cuenta?{" "}
            <a href="/registro" className="font-semibold text-primary hover:text-primary-hover hover:underline">
              Regístrate
            </a>
          </p>
          <h2 className="text-3xl font-extrabold text-text-main">
            Iniciar <span className="text-primary">sesión</span>
          </h2>
        </div>

        <FieldGroup className="gap-5">
          <CampoTexto
            control={form.control}
            name="correo"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="Ej. ejemplo@ues.mx"
            required
          />
          <CampoTexto
            control={form.control}
            name="clave"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            required
          />
        </FieldGroup>

        <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl text-base font-semibold hover:bg-primary-hover">
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
        </Button>
      </form>
    </div>
  );
};

export default IniciarSesionView;
