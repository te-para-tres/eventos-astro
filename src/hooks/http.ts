import type { DefaultResponse, TPaginacion } from "../types/responded";

export interface IRequestParams {
    expand?: string;
    ordenar?: string | "id-desc" | "id-asc";
    limite?: number;
    pagina?: number;
    buscar?: string;

    [key: string]: any;
}

export interface IRequest {
    req: string;
    endpoint: string;
    params: any;
    body: any;
}

const API_URL = "https://api.eventues.app/";
export interface IHttpService {
    get: <T>(
        endpoint: string,
        params?: any,
        updateQueryParams?: boolean
    ) => Promise<DefaultResponse<T>>;
    getBlob: (endpoint: string, data: any) => Promise<Blob>;
    downloadBlob: (
        endpoint: string,
        data: any,
        fileName: string
    ) => Promise<void>;
    post: <T>(endpoint: string, body: any) => Promise<DefaultResponse<T>>;
    postFormData: (endpoint: string, data: any) => Promise<DefaultResponse<any>>;
    delete: <T>(endpoint: string, body: T) => Promise<DefaultResponse<any>>;
    put: (endpoint: string, body: any) => Promise<any>;
}

export class HttpService implements IHttpService {
    API_URL: string;

    constructor(API_URL: string) {
        this.API_URL = API_URL;
    }

    static DEFAULT_HEADERS = () => {
        return {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
    };

    static FILE_HEADERS = () => {
        return {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
    };

    static DEFAULT_REQUEST_PARAMS = {
        limite: 10,
        pagina: 1,
        ordenar: "id-desc",
    };

    static DEFAULT_PAGINACION: TPaginacion = {
        total: 0,
        pagina: 1,
        limite: 10,
    };

    static paramsToQuery = (params: any) => {
        return Object.keys(params)
            .map(
                (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
            )
            .join("&");
    };

    static EMPTY_REQUEST = (): IRequest => ({
        req: "",
        endpoint: "",
        params: null,
        body: null,
    });

    static GET_REQUEST = (endpoint: string, params: any = {}): IRequest => ({
        req: "GET",
        endpoint,
        params,
        body: null,
    });

    static POST_REQUEST = <T = any>(
        endpoint: string,
        body: T,
        params: any = {}
    ): IRequest => ({
        req: "POST",
        endpoint,
        params,
        body,
    });

    static DELETE_REQUEST = (endpoint: string, params: any = {}) =>
    ({
        req: "DELETE",
        endpoint: `${endpoint}/eliminar`,
        body: {
            ...params,
        },
    } as IRequest);

    get = async <T>(
        endpoint: string,
        params: any = HttpService.DEFAULT_REQUEST_PARAMS,
        updateQueryParams: boolean = false,
        defaultEndpoint: boolean = true
    ) => {
        const stringParams = params ? HttpService.paramsToQuery(params) : "";
        const queryParams = `?${new URLSearchParams(stringParams).toString()}`;
        let url = `${endpoint}`;

        if (defaultEndpoint) {
            url = `${this.API_URL}${endpoint}`;
        }

        if (queryParams) {
            url = `${url}${queryParams}`;

            if (updateQueryParams && window.location.search !== queryParams) {
                //Actualizar los queryparams de la url actual
                window.history.pushState(
                    {},
                    "",
                    window.location.pathname + `${queryParams}`
                );
            }
        }

        const _response = await fetch(url, {
            method: "GET",
            headers: HttpService.DEFAULT_HEADERS(),
        });

        const response = (await _response.json()) as DefaultResponse<T>;

        return {
            ...response,
            isError: response?.status !== 200 ? true : false,
            status: _response?.status,
            resultado: response?.resultado || response,
        } as DefaultResponse<T>;
    };

    getBlob = async (endpoint: string, data: any) => {
        const _response = await fetch(`${this.API_URL}${endpoint}`, {
            method: "GET",
            headers: HttpService.DEFAULT_HEADERS(),
            body: JSON.stringify(data),
        });
        const response = await _response.blob();
        return response;
    };

    downloadBlob = async (
        endpoint: string,
        data: any,
        fileName: string = "fileName"
    ) => {
        const _response = await fetch(`${this.API_URL}${endpoint}`, {
            method: "GET",
            headers: HttpService.DEFAULT_HEADERS(),
            body: JSON.stringify(data),
        });
        const blob = await _response.blob();

        const urlBlob = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(urlBlob);
        link.remove();
    };

    post = async <T>(
        endpoint: string,
        body: any,
        defaultEndpoint: boolean = true
    ) => {
        let url = `${endpoint}`;

        if (defaultEndpoint) {
            url = `${this.API_URL}${endpoint}`;
        }
        const _response = await fetch(`${url}`, {
            method: "POST",
            headers: HttpService.DEFAULT_HEADERS(),
            body: JSON.stringify(body),
        });
        const status = _response.status;
        const response = (await _response.json()) as DefaultResponse<T>;

        return {
            ...response,
            isError: status !== 200 ? true : false,
            status: status,
        } as DefaultResponse<T>;
    };

    postFormData = async (endpoint: string, data: any) => {
        const _response = await fetch(`${this.API_URL}${endpoint}`, {
            method: "POST",
            headers: HttpService.FILE_HEADERS(),
            body: data,
        });

        const response = await _response.json;

        return {
            ...response,
            isError: _response?.status !== 200 ? true : false,
            status: _response?.status,
        } as DefaultResponse<any>;
    };

    delete = async <T = any>(endpoint: string, body: T) => {
        const response = await fetch(`${this.API_URL}${endpoint}`, {
            body: JSON.stringify(body),
            method: "DELETE",
            headers: HttpService.DEFAULT_HEADERS(),
        });

        const status = response.status;
        const responseJson = await response.json();
        return {
            ...responseJson,
            isError: status !== 200 ? true : false,
            status: status,
        } as DefaultResponse<any>;
    };

    put = async (endpoint: string, body: any) => {
        const response = await fetch(`${this.API_URL}${endpoint}`, {
            method: "PUT",
            headers: HttpService.DEFAULT_HEADERS(),
            body: JSON.stringify(body),
        });
        return response.json();
    };
}

export const http = new HttpService(API_URL);
