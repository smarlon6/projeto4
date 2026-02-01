import axios from "axios";
import type { TokenPayload } from "../../../lib/tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const authFacade = {
  async login(username: string, password: string) {
    const res = await axios.post<TokenPayload>(
      `${baseURL}/autenticacao/login`,
      { username, password },
      { timeout: 15000 }
    );
    return res.data;
  },

  async refresh(refreshToken: string) {
    const res = await axios.put<TokenPayload>(
      `${baseURL}/autenticacao/refresh`,
      null,
      {
        timeout: 15000,
        headers: {
          Authorization: `Bearer ${refreshToken}`, // refresh token aqui
        },
      }
    );
    return res.data;
  },
};
