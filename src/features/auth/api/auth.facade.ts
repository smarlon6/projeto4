import { http } from "../../../lib/http";
import type { TokenPayload } from "../../../lib/tokenStorage";

export const authFacade = {
  async login(username: string, password: string) {
    const res = await http.post<TokenPayload>("/autenticacao/login", {
      username,
      password,
    });
    return res.data;
  },

  async refresh(refreshToken: string) {
    // Tenta 1) sem Bearer (muito comum)
    try {
      const res = await http.put<TokenPayload>(
        "/autenticacao/refresh",
        {},
        { headers: { Authorization: refreshToken } }
      );
      return res.data;
    } catch {
      // Tenta 2) com Bearer
      const res = await http.put<TokenPayload>(
        "/autenticacao/refresh",
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );
      return res.data;
    }
  },
};
