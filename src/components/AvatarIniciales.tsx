import { cn } from "@/lib/utils";

interface Props {
  nombre?: string;
  apellidos?: string;
  className?: string;
}

const AvatarIniciales: React.FC<Props> = ({ nombre = "", apellidos = "", className }) => {
  const iniciales = `${nombre.trim().charAt(0)}${apellidos.trim().charAt(0)}`.toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-text-light select-none",
        className,
      )}
    >
      {iniciales || "?"}
    </span>
  );
};

export default AvatarIniciales;
