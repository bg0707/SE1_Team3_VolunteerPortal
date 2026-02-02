const fallbackBaseUrl = "http://localhost:3001/api";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = (rawBaseUrl?.trim() || fallbackBaseUrl).replace(
  /\/+$/,
  ""
);

export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api$/, "");
