import { useState } from "react";

type CheckResult = {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  statusCode?: number;
};

export default function CorsStatus() {
  const [plannerId, setPlannerId] = useState("https://www.lastepochtools.com/planner/QqwgE5d3"); // Default example ID
  const [results, setResults] = useState<{ [key: string]: CheckResult }>({
    direct: { status: "idle" },
    proxy1: { status: "idle" },
    proxy2: { status: "idle" },
  });

  const runCheck = async () => {
    const id = plannerId.trim().split("/").pop() || "";

    const endpoints = [
      {
        key: "direct",
        url: `https://www.lastepochtools.com/planner/${id}`,
        options: { method: "GET" },
      },
      {
        key: "proxy1",
        url: `https://let-proxy.lastepochplanner.com/planner/${id}`,
        options: { method: "GET" },
      },
      {
        key: "proxy2",
        url: `https://let-proxy2.lastepochplanner.com/planner/${id}`,
        options: { method: "GET" },
      },
    ];

    endpoints.forEach(async (endpoint) => {
      setResults((prev) => ({ ...prev, [endpoint.key]: { status: "loading" } }));

      try {
        const response = await fetch(endpoint.url, endpoint.options as RequestInit);
        if (response.ok) {
          setResults((prev) => ({
            ...prev,
            [endpoint.key]: { status: "success", statusCode: response.status, message: "OK" },
          }));
        } else {
          setResults((prev) => ({
            ...prev,
            [endpoint.key]: { status: "error", statusCode: response.status, message: `HTTP Error: ${response.statusText}` },
          }));
        }
      } catch (err) {
        setResults((prev) => ({
          ...prev,
          [endpoint.key]: {
            status: "error",
            message: err instanceof Error ? err.message : "CORS Error or Network Failure"
          },
        }));
      }
    });
  };

  const getStatusBadge = (res: CheckResult) => {
    switch (res.status) {
      case "loading": return <div className="badge badge-warning">Testing...</div>;
      case "success": return <div className="badge badge-success text-white">Success ({res.statusCode})</div>;
      case "error": return <div className="badge badge-error text-white">Failed</div>;
      default: return <div className="badge badge-ghost">Idle</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-base-content">
      <section className="hero bg-base-200 py-12">
        <div className="hero-content text-center flex flex-col items-center z-10">
          <h1 className="text-5xl font-bold mb-5">
            <a href="/">Last Epoch Planner Web</a>
          </h1>
          <p className="text-xl opacity-70">CORS & Proxy Status Diagnostic</p>
        </div>
      </section>

      <section className="flex-grow py-10 px-4 bg-base-100 max-w-4xl mx-auto w-full">
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">Test Access</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Planner ID or URL (e.g. QqwgE5d3)"
                className="input input-bordered flex-grow"
                value={plannerId}
                onChange={(e) => setPlannerId(e.target.value)}
              />
              <button className="btn btn-primary" onClick={runCheck}>
                Check Status
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full shadow-sm border border-base-300">
            <thead>
              <tr className="bg-base-300">
                <th>Method / Endpoint</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="font-bold">Direct Access</div>
                  <div className="text-xs opacity-50 truncate max-w-xs">lastepochtools.com/planner/...</div>
                </td>
                <td>{getStatusBadge(results.direct)}</td>
                <td className="text-sm font-mono">{results.direct.message || "-"}</td>
              </tr>
              <tr>
                <td>
                  <div className="font-bold">Proxy 1</div>
                  <div className="text-xs opacity-50 truncate max-w-xs">let-proxy.lastepochplanner.com</div>
                </td>
                <td>{getStatusBadge(results.proxy1)}</td>
                <td className="text-sm font-mono">{results.proxy1.message || "-"}</td>
              </tr>
              <tr>
                <td>
                  <div className="font-bold">Proxy 2</div>
                  <div className="text-xs opacity-50 truncate max-w-xs">let-proxy2.lastepochplanner.com</div>
                </td>
                <td>{getStatusBadge(results.proxy2)}</td>
                <td className="text-sm font-mono">{results.proxy2.message || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center flex items-center p-8 bg-base-300 text-base-content">
        <aside className="flex-1">
          <span>
            © 2025 Musholic (
            <a className="link" href="https://github.com/musholic" target="_blank" rel="noreferrer">
              @musholic
            </a> )
            © 2025 Koji AGAWA (
            <a className="link" href="https://x.com/atty303" target="_blank" rel="noreferrer">
              @atty303
            </a>
            ) - This product isn't affiliated with or endorsed by Eleventh Hour Games in any way.
          </span>
        </aside>
        <div>
          <a href="privacy">Privacy policy</a>
        </div>
        <div className="flex-none">
          <a href="https://github.com/musholic/pob-web" target="_blank" rel="noreferrer">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 98 96">
              <title>GitHub</title>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
              />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
