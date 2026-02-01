import { BehaviorSubject } from "rxjs";
import { tokenStorage, type TokenPayload } from "../../../lib/tokenStorage";
import { authFacade } from "../api/auth.facade";

type AuthUser = {
  username: string;
};

type AuthState = {
  status: "unknown" | "authenticated" | "unauthenticated";
  loading: boolean;
  error: string | null;
  user: AuthUser | null;
};

const initialState: AuthState = {
  status: "unknown",
  loading: false,
  error: null,
  user: null,
};

const subject = new BehaviorSubject<AuthState>(initialState);

export const authStore = {
  state$: subject.asObservable(),
  get snapshot() {
    return subject.value;
  },

  bootstrap() {
    // Decide estado com base nos tokens existentes
    const access = tokenStorage.getAccess();
    const refresh = tokenStorage.getRefresh();

    if (access && refresh) {
      subject.next({ ...subject.value, status: "authenticated", user: { username: "admin" } });
    } else {
      subject.next({ ...subject.value, status: "unauthenticated", user: null });
    }
  },

  async login(username: string, password: string) {
    subject.next({ ...subject.value, loading: true, error: null });

    try {
      const payload: TokenPayload = await authFacade.login(username, password);
      tokenStorage.setTokens(payload);

      subject.next({
        status: "authenticated",
        loading: false,
        error: null,
        user: { username },
      });

      return payload;
    } catch (e: any) {
      tokenStorage.clear();
      subject.next({
        status: "unauthenticated",
        loading: false,
        error: e?.response?.status === 401 ? "Usuário ou senha inválidos" : (e?.message ?? "Erro ao autenticar"),
        user: null,
      });
      return null;
    }
  },

  logout() {
    tokenStorage.clear();
    subject.next({
      status: "unauthenticated",
      loading: false,
      error: null,
      user: null,
    });
  },

  setError(msg: string | null) {
    subject.next({ ...subject.value, error: msg });
  },
};
