import { http } from "./http";

export async function readinessCheck() {
  // Readiness: API respondendo (mínimo)
  const res = await http.get("/v1/pets", { params: { page: 0, size: 1 } });
  return res.status >= 200 && res.status < 300;
}

export function livenessCheck() {
  // Liveness: app carregou
  return true;
}
