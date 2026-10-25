import type { LucideIcon } from "lucide-react";

interface Props {
  icono: LucideIcon;
  etiqueta: string;
  valor?: string;
}

const DatoPerfil: React.FC<Props> = ({ icono: Icono, etiqueta, valor }) => (
  <div className="flex items-start gap-3">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icono className="size-5" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <dt className="text-xs font-semibold text-primary">{etiqueta}</dt>
      <dd className="break-words text-sm text-text-main sm:text-base">{valor || "Sin registrar"}</dd>
    </div>
  </div>
);

export default DatoPerfil;
