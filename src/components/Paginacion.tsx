import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

interface Props {
  pagina: number;
  total: number;
  limite: number;
  onPageChange: (pagina: number) => void;
  etiqueta?: string;
}

const Paginacion: React.FC<Props> = ({ pagina, total, limite, onPageChange, etiqueta = "resultados" }) => {
  const totalPaginas = Math.ceil(total / limite);
  const desde = total === 0 ? 0 : (pagina - 1) * limite + 1;
  const hasta = Math.min(pagina * limite, total);

  const paginasVisibles = useMemo<(number | "...")[]>(() => {
    if (totalPaginas <= 7) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    }
    const paginas: (number | "...")[] = [1];
    if (pagina > 3) paginas.push("...");
    for (let i = Math.max(2, pagina - 1); i <= Math.min(totalPaginas - 1, pagina + 1); i++) {
      paginas.push(i);
    }
    if (pagina < totalPaginas - 2) paginas.push("...");
    paginas.push(totalPaginas);
    return paginas;
  }, [pagina, totalPaginas]);

  const irAPagina = (p: number) => {
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-12 flex flex-col items-center gap-3">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => pagina > 1 && irAPagina(pagina - 1)}
              className={pagina === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
            />
          </PaginationItem>

          {paginasVisibles.map((p, i) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === pagina}
                  onClick={() => irAPagina(p)}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => pagina < totalPaginas && irAPagina(pagina + 1)}
              className={pagina === totalPaginas ? "pointer-events-none opacity-40" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-sm text-gray-400">
        Mostrando {desde} – {hasta} de {total} {etiqueta}
      </p>
    </div>
  );
};

export default Paginacion;
