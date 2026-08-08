import { useEffect, useState } from "react";
import api from "../../../api/axios";

const FALLBACK = [
  { id: 1, name: "Ananya Rao", email: "ananya@example.com", phone: "+91 98765 43210" },
  { id: 2, name: "Vikram Shah", email: "vikram@example.com", phone: "+91 91234 56780" },
  { id: 3, name: "Priya Nair", email: "priya@example.com", phone: "+91 99887 66554" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(FALLBACK);

  useEffect(() => {
    api.get("/users/all").then((res) => setUsers(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl text-white mb-1">Registered users</h1>
      <p className="text-console-mist/50 text-sm mb-8">{users.length} accounts on the platform.</p>

      <div className="bg-console-panel border border-white/5 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-console-mist/40 border-b border-white/5">
              <th className="px-6 py-3 font-normal">Name</th>
              <th className="px-6 py-3 font-normal">Email</th>
              <th className="px-6 py-3 font-normal">Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0">
                <td className="px-6 py-3.5 text-white">{u.name}</td>
                <td className="px-6 py-3.5 text-console-mist/70 font-mono text-xs">{u.email}</td>
                <td className="px-6 py-3.5 text-console-mist/70 font-mono text-xs">{u.phone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
