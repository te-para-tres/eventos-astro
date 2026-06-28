export const API_URL =
  import.meta.env.PUBLIC_API_URL || "http://localhost:8080/";
export const IS_DEV = import.meta.env.PUBLIC_IS_DEV === "true";
export const SHOW_DEVTOOLS = import.meta.env.PUBLIC_SHOW_DEVTOOLS === "true";
export const VERSION = import.meta.env.PUBLIC_VERSION;
export const PROJECT_NAME = import.meta.env.PUBLIC_PROJECT_NAME;
export const URL_RECURSOS = `${API_URL}/recursos`;
