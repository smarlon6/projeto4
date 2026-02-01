import { Outlet } from "react-router-dom";
import { Sidebar } from "../shared/components/Sidebar";
import { Topbar } from "../shared/components/Topbar";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
