import { useEffect } from "react";
import { LogIn, LogOut, UserRound } from "lucide-react";
import AvatarIniciales from "@/components/AvatarIniciales";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";

const ESTILO_FOCO = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const NavbarSesion: React.FC = () => {
  const { usuario, cerrarSesion, asegurarToken } = useAuth();

  useEffect(() => {
    asegurarToken();
  }, []);

  if (!usuario) {
    return (
      <a
        href="/iniciar-sesion"
        aria-label="Iniciar sesión"
        className={`flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover ${ESTILO_FOCO}`}
      >
        <LogIn className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Iniciar sesión</span>
      </a>
    );
  }

  const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`;

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Menú de ${nombreCompleto}`}
        className={`rounded-full transition-transform active:scale-[0.97] ${ESTILO_FOCO}`}
      >
        <AvatarIniciales nombre={usuario.nombre} apellidos={usuario.apellidos} />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-64 rounded-xl bg-bg-card p-2">
        <div className="flex items-center gap-3 border-b border-border-custom px-2 pt-1 pb-3">
          <AvatarIniciales nombre={usuario.nombre} apellidos={usuario.apellidos} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-text-main">{nombreCompleto}</p>
            <p className="truncate text-xs text-text-muted">{usuario.correo}</p>
          </div>
        </div>
        <a
          href="/perfil"
          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-text-main transition-colors hover:bg-primary/10 hover:text-primary ${ESTILO_FOCO}`}
        >
          <UserRound className="size-4" aria-hidden="true" />
          Mi perfil
        </a>
        <button
          type="button"
          onClick={cerrarSesion}
          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 ${ESTILO_FOCO}`}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default NavbarSesion;
