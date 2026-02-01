import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { authFacade } from "../features/auth/api/auth.facade";
import { authStore } from "../features/auth/state/auth.store";

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

function rejectQueue(_err: any) {
  pendingQueue = [];
}

function forceLogout() {
  tokenStorage.clear();
  authStore.logout();

  // Redirect hard (funciona mesmo fora de componentes React)
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config;

    if (!original || original._retry) {
      return Promise.reject(error);
    }

    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ✅ Evita loop infinito com endpoints de auth
    const url = String(original?.url || "");
    if (url.includes("/autenticacao/login") || url.includes("/autenticacao/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          try {
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(http(original));
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    isRefreshing = true;

    try {
      const payload = await authFacade.refresh(refreshToken);
      tokenStorage.setTokens(payload);

      const newAccess = payload.access_token;
      resolveQueue(newAccess);

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newAccess}`;
      return http(original);
    } catch (e) {
      rejectQueue(e);
      forceLogout();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);
