import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { authFacade } from "../features/auth/api/auth.facade";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

function resolveQueue(newAccessToken: string) {
  pendingQueue.forEach((cb) => cb(newAccessToken));
  pendingQueue = [];
}

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("AUTH HEADER:", config.headers?.Authorization);
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config;

    // Se não tem config ou já tentou refresh nessa mesma request, devolve erro
    if (!original || original._retry) {
      return Promise.reject(error);
    }

    // Se não for 401, devolve
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) {
      tokenStorage.clear();
      return Promise.reject(error);
    }

    // Marca como retry
    original._retry = true;

    // Se já está fazendo refresh, enfileira a request
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(http(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const payload = await authFacade.refresh(refreshToken);
      tokenStorage.setTokens(payload);

      const newAccess = payload.access_token;
      resolveQueue(newAccess);

      original.headers.Authorization = `Bearer ${newAccess}`;
      return http(original);
    } catch (e) {
      tokenStorage.clear();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);
