import { useEffect, useState } from "react";
import { livenessCheck, readinessCheck } from "../lib/health";

export function HealthPage() {
  const [live] = useState(livenessCheck());
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    readinessCheck().then(setReady).catch(() => setReady(false));
  }, []);

  return (
    <div className="p-6">
      <div className="text-xl font-bold text-slate-800">Health</div>

      <div className="mt-4 space-y-2 text-sm">
        <div>Liveness: <b>{live ? "OK" : "FAIL"}</b></div>
        <div>Readiness (API): <b>{ready === null ? "CHECKING..." : ready ? "OK" : "FAIL"}</b></div>
      </div>
    </div>
  );
}
