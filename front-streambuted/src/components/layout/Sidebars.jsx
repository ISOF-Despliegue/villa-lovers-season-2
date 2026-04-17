import { 
  IcHome, IcSearch, IcLib, IcSettings, 
  IcDashboard, IcTracks, IcUpload, IcChart, 
  IcOverview, IcUsers, IcContent, IcReport, IcShield 
} from '../icons/Icons';

export function ListenerSidebar({ page, setPage, user }) {
  const items = [
    { id: "home", label: "Home", icon: <IcHome /> },
    { id: "search", label: "Buscar", icon: <IcSearch /> },
    { id: "library", label: "Biblioteca", icon: <IcLib /> },
    { id: "settings", label: "Configuración", icon: <IcSettings /> },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">S</div>
        <div className="logo-text">StreamButed</div>
      </div>
      <div className="sidebar-section">
        {items.map(it => (
          <div key={it.id} className={`nav-item${page === it.id ? " active" : ""}`} onClick={() => setPage(it.id)}>
            {it.icon}<span>{it.label}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{user.name[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">Oyente</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArtistSidebar({ page, setPage, user }) {
  const items = [
    { id: "artist-dashboard", label: "Dashboard", icon: <IcDashboard /> },
    { id: "artist-tracks", label: "Mis Pistas", icon: <IcTracks /> },
    { id: "artist-upload", label: "Subir Pista", icon: <IcUpload /> },
    { id: "artist-analytics", label: "Analíticas", icon: <IcChart /> },
    { id: "settings", label: "Configuración", icon: <IcSettings /> },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">S</div>
        <div className="logo-text">StreamButed</div>
      </div>
      <div className="sidebar-section">
        {items.map(it => (
          <div key={it.id} className={`nav-item${page === it.id ? " active" : ""}`} onClick={() => setPage(it.id)}>
            {it.icon}<span>{it.label}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{user.name[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">Artista</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar({ page, setPage, user }) {
  const items = [
    { id: "admin-overview", label: "Overview", icon: <IcOverview /> },
    { id: "admin-users", label: "Usuarios", icon: <IcUsers /> },
    { id: "admin-content", label: "Contenido", icon: <IcContent /> },
    { id: "admin-reports", label: "Reportes", icon: <IcReport /> },
    { id: "admin-moderation", label: "Moderación", icon: <IcShield /> },
    { id: "settings", label: "Configuración", icon: <IcSettings /> },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">S</div>
        <div className="logo-text">StreamButed</div>
      </div>
      <div style={{ padding: "10px 20px 4px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "var(--t3)", textTransform: "uppercase" }}>Panel Admin</div>
      <div className="sidebar-section" style={{ paddingTop: 4 }}>
        {items.map(it => (
          <div key={it.id} className={`nav-item${page === it.id ? " active" : ""}`} onClick={() => setPage(it.id)}>
            {it.icon}<span>{it.label}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar" style={{ background: "rgba(167,139,250,0.2)", color: "#A78BFA" }}>{user.name[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">Administrador</div>
          </div>
        </div>
      </div>
    </div>
  );
}