import { useEffect, useState } from "react";
import { navigate } from "astro:transitions/client";
import { BookOpen, Hash, Mail, Phone, School, UserX } from "lucide-react";
import { toast } from "sonner";
import AvatarIniciales from "@/components/AvatarIniciales";
import { Spinner } from "@/components/ui/spinner";
import { http } from "@/hooks/http";
import { useAuth } from "@/hooks/useAuth";
import { Estudiante } from "@/models/Estudiante.model";
import DatoPerfil from "./DatoPerfil";

const PerfilView: React.FC = () => {
  const { asegurarToken } = useAuth();
  const [perfil, setPerfil] = useState<Estudiante | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      if (!(await asegurarToken())) return navigate("/iniciar-sesion");

      try {
        const res = await http.get<Estudiante[]>(Estudiante.ENDPOINTS.DEFAULT, { expand: Estudiante.EXPAND.DEFAULT });
        if (res.isError || !res.resultado?.length) {
          toast.error(res.mensaje || "No se pudo obtener tu perfil");
          return;
        }

        setPerfil(Estudiante.fromJson(res.resultado[0]));
      } catch {
        toast.error("Ocurrió un problema al obtener tu perfil");
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-text-muted">
        <UserX className="size-10" aria-hidden="true" />
        <p className="text-sm">No pudimos cargar tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-extrabold text-text-main">
        Mi <span className="text-primary">perfil</span>
      </h1>

      <section className="rounded-xl border-t-4 border-primary bg-bg-card p-6 shadow-md md:p-8">
        <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <AvatarIniciales nombre={perfil.nombre} apellidos={perfil.apellidos} className="size-20 text-2xl" />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-text-main">
              {perfil.nombre} {perfil.apellidos}
            </h2>
            <p className="text-sm text-text-muted">Estudiante</p>
          </div>
        </div>

        <dl className="grid gap-6 sm:grid-cols-2">
          <DatoPerfil icono={Hash} etiqueta="Expediente" valor={perfil.expediente} />
          <DatoPerfil icono={Mail} etiqueta="Correo electrónico" valor={perfil.correo} />
          <DatoPerfil icono={Phone} etiqueta="Teléfono" valor={perfil.telefono} />
          <DatoPerfil icono={School} etiqueta="Unidad académica" valor={perfil.unidadAcademica?.nombre} />
          <DatoPerfil icono={BookOpen} etiqueta="Carrera" valor={perfil.carrera?.nombre} />
        </dl>
      </section>
    </div>
  );
};

export default PerfilView;
