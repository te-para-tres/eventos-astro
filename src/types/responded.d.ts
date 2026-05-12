export type TPaginacion = {
    limite: number;
    total: number;
    pagina: number;
};

export type DefaultResponse<T = any> = {
    isError: boolean;
    status: number;
    resultado: T | null;
    detalle: T | null;
    paginacion: TPaginacion | null;
    mensaje: string | null;
    [key: string]: any
}