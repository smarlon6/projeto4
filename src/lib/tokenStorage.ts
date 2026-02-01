export type TokenPayload = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
};

const ACCESS_KEY = "petmt_access_token";
const REFRESH_KEY = "petmt_refresh_token";

export const tokenStorage = {
  getAccess() {
    return localStorage.getItem(ACCESS_KEY) || "";
  },
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY) || "";
  },
  setTokens(payload: TokenPayload) {
    localStorage.setItem(ACCESS_KEY, payload.access_token);
    localStorage.setItem(REFRESH_KEY, payload.refresh_token);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
