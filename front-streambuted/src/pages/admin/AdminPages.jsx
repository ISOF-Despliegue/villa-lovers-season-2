import { useState } from "react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { IcSearch, IcCheck, IcX, IcMusic } from "../../components/icons/Icons";
import { USERS_MOCK, FLAGGED_MOCK, ACTIVITY, trafficData, usersData, pieData, COLORS_PIE } from "../../data/mockData";

export function AdminOverviewPage() {
  return (
    <div className="page-inner">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div className="page-title">Overview</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="filter-btn">Últimos 30 días ▾</button>
          <button className="btn-ghost" style={{ fontSize: 13 }}>Export</button>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card"><div className="stat-card-label">Total Users</div><div className="stat-card-value">1,284,039</div><div className="stat-card-delta">+4.2% vs last period</div></div>
        <div className="stat-card"><div className="stat-card-label">Total Songs</div><div className="stat-card-value">842,610</div><div className="stat-card-delta">+1.8% vs last period</div></div>
        <div className="stat-card"><div className="stat-card-label">Active Today</div><div className="stat-card-value">93,210</div><div className="stat-card-delta">+11.3% vs last period</div></div>
        <div className="stat-card"><div className="stat-card-label">New Signups</div><div className="stat-card-value">2,041</div><div className="stat-card-delta">+8.7% vs last period</div></div>
      </div>

      <div className="chart-grid">
        <div className="chart-card" style={{ gridColumn: "1" }}>
          <div className="chart-card-title">Network Traffic</div>
          <div className="chart-card-sub">Requests / sec</div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={trafficData}>
              <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E8960A" stopOpacity={0.3}/><stop offset="95%" stopColor="#E8960A" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="m" hide />
              <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="v" stroke="#E8960A" fill="url(#tg)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Active Users</div>
          <div className="chart-card-sub">Daily unique</div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={usersData}>
              <defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/><stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="m" hide />
              <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="v" stroke="#38BDF8" fill="url(#ug)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Genres</div>
          <div className="chart-card-sub">Distribución</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <PieChart width={100} height={100}>
              <Pie data={pieData} cx={45} cy={45} innerRadius={28} outerRadius={45} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS_PIE[i]} />)}
              </Pie>
            </PieChart>
            <div className="chart-legend">
              {pieData.map((d, i) => (
                <div key={d.name} className="legend-item">
                  <div className="legend-dot" style={{ background: COLORS_PIE[i] }} />
                  <span>{d.name}</span>
                  <span className="legend-pct">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14, color: "var(--t1)" }}>Recent Activity</div>
        <table className="data-table">
          <thead><tr><th>User</th><th>Action</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {ACTIVITY.map((a, i) => (
              <tr key={i}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>U</div>{a.user}</div></td>
                <td style={{ color: "var(--accent)" }}>{a.action}</td>
                <td style={{ color: "var(--t2)" }}>{a.date}</td>
                <td><span className={a.status === "Approved" || a.status === "Done" ? "status-badge-done" : "status-badge-pending"}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminUsersPage({ toast }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(USERS_MOCK);
  const filtered = users.filter(u => u.email.includes(search) || u.username.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
    toast("Estado actualizado ✓");
  };

  return (
    <div className="page-inner">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="page-title">User Management</div>
          <div style={{ fontSize: 13, color: "var(--t2)", marginTop: 2 }}>1,284,039 usuarios</div>
        </div>
      </div>
      <div className="table-wrap">
        <div className="table-header">
          <div className="table-search">
            <span className="table-search-icon"><IcSearch /></span>
            <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="filter-btn">Role: All ▾</button>
          <button className="filter-btn">Status: All ▾</button>
        </div>
        <table className="data-table">
          <thead><tr><th>User ID</th><th>Email</th><th>Username</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td style={{ color: "var(--t3)", fontFamily: "monospace" }}>{u.id}</td>
                <td style={{ color: "var(--t2)" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="user-avatar" style={{ width: 24, height: 24, fontSize: 10 }}>U</div>{u.email}</div></td>
                <td style={{ fontWeight: 500 }}>{u.username}</td>
                <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className={`status-dot ${u.status === "active" ? "status-active" : "status-suspended"}`} />
                    <span style={{ fontSize: 13, color: u.status === "active" ? "var(--t2)" : "var(--danger)" }}>
                      {u.status === "active" ? "Active" : "Suspended"}
                    </span>
                  </div>
                </td>
                <td>
                  <button className={u.status === "active" ? "btn-danger" : "btn-ghost"} style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => toggle(u.id)}>
                    {u.status === "active" ? "Suspend" : "Reinstate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>Showing 1–15 of {filtered.length} results</span>
          <div className="page-btns">
            {[1,2,3,"…",10].map((p, i) => <div key={i} className={`page-num${p === 1 ? " active" : ""}`}>{p}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminModerationPage({ toast }) {
  const [items, setItems] = useState(FLAGGED_MOCK);
  const [search, setSearch] = useState("");
  const filtered = items.filter(it => it.id.includes(search) || it.reason.toLowerCase().includes(search.toLowerCase()));

  const remove = (id, approved) => {
    setItems(its => its.filter(it => it.id !== id));
    toast(approved ? "Contenido aprobado ✓" : "Contenido eliminado ✓");
  };

  return (
    <div className="page-inner">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="page-title">Content Moderation</div>
          <div style={{ fontSize: 13, color: "var(--t2)", marginTop: 2 }}>{items.length} elementos marcados</div>
        </div>
      </div>
      <div className="table-wrap">
        <div className="table-header">
          <div className="table-search">
            <span className="table-search-icon"><IcSearch /></span>
            <input placeholder="Search by ID, artist, reason..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="filter-btn">All Reasons ▾</button>
        </div>
        <table className="data-table">
          <thead><tr><th>Track / Album ID</th><th>Artist</th><th>Report Reason</th><th>Date Reported</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(it => (
              <tr key={it.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--bg4)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)", fontSize: 12 }}><IcMusic /></div>
                    <div>
                      <div style={{ fontWeight: 500, color: "var(--accent)" }}>{it.id}</div>
                      <div style={{ fontSize: 12, color: "var(--t3)" }}>{it.type}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--t1)" }}>{it.artist}</td>
                <td><div className="moderation-reason"><span className="reason-dot" />{it.reason}</div></td>
                <td style={{ color: "var(--t2)", fontSize: 12 }}>{it.date}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="approve-btn" onClick={() => remove(it.id, true)} title="Aprobar"><IcCheck /></button>
                    <button className="reject-btn" onClick={() => remove(it.id, false)} title="Eliminar"><IcX /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5}>
                <div className="empty-state"><div className="empty-icon">🛡️</div><div className="empty-text">No hay elementos pendientes</div></div>
              </td></tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <span>Showing 1–{filtered.length} of {filtered.length} results</span>
          <div className="page-btns">
            {[1,2,3,"…",10].map((p, i) => <div key={i} className={`page-num${p === 1 ? " active" : ""}`}>{p}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}