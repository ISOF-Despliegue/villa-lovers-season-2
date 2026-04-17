import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { IcMusic } from "../../components/icons/Icons";
import { TRACKS, ALBUMS, GENRES, fmtNum, fmtTime, trafficData } from "../../data/mockData";
import { TrackRow } from "../../components/ui/TrackRow";

export function ArtistDashboardPage({ user, onPlayTrack, currentTrack, setPage }) {
  const myTracks = TRACKS.filter(t => t.artistId === "a1");
  const myAlbums = ALBUMS.filter(a => a.artistId === "a1");
  const totalPlays = myTracks.reduce((s, t) => s + t.plays, 0);
  return (
    <div className="page-inner">
      <div className="page-header">
        <div className="artist-view-badge">🎵 Artista</div>
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">Bienvenido de vuelta, {user.name}</div>
      </div>
      <div className="stat-cards" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-card-label">Total Reproducciones</div><div className="stat-card-value">{fmtNum(totalPlays)}</div><div className="stat-card-delta">+12.4% vs mes anterior</div></div>
        <div className="stat-card"><div className="stat-card-label">Pistas Publicadas</div><div className="stat-card-value">{myTracks.length}</div></div>
        <div className="stat-card"><div className="stat-card-label">Álbumes</div><div className="stat-card-value">{myAlbums.length}</div></div>
      </div>
      <div className="section">
        <div className="section-header">
          <div className="section-title">Mis Pistas Recientes</div>
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => setPage("artist-tracks")}>Ver todas</button>
        </div>
        <table className="track-list">
          <thead><tr><th style={{ width: 40 }}>#</th><th>Título</th><th>Reproducciones</th><th style={{ textAlign: "right" }}>Duración</th></tr></thead>
          <tbody>{myTracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} isPlaying={currentTrack?.id === t.id} onPlay={() => onPlayTrack(t)} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function MyTracksPage({ setPage, setEditTrack, toast }) {
  const myTracks = TRACKS.filter(t => t.artistId === "a1");
  return (
    <div className="page-inner">
      <div className="my-tracks-header">
        <div className="page-title">Mis Pistas</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" onClick={() => setPage("artist-upload")}>+ Subir Pista</button>
          <button className="btn-primary" onClick={() => setPage("artist-album")}>+ Crear Álbum</button>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Título</th><th>Género</th><th>Reproducciones</th><th>Duración</th><th>Acciones</th></tr></thead>
          <tbody>
            {myTracks.map(t => (
              <tr key={t.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="track-thumb"><div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)" }}><IcMusic /></div></div>
                    <div><div style={{ fontWeight: 500, color: "var(--t1)" }}>{t.title}</div><div style={{ fontSize: 12, color: "var(--t3)" }}>track_{t.id}.mp3</div></div>
                  </div>
                </td>
                <td style={{ color: "var(--t2)" }}>{t.genre}</td>
                <td style={{ color: "var(--t2)" }}>{fmtNum(t.plays)}</td>
                <td style={{ color: "var(--t2)" }}>{fmtTime(t.duration)}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => { setEditTrack(t); setPage("artist-edit-track"); }}>Editar</button>
                    <button className="btn-danger" style={{ padding: "5px 12px" }} onClick={() => toast("Pista eliminada")}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UploadSinglePage({ toast }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: "", genre: "", desc: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page-inner">
      <div className="page-header"><div className="page-title">Upload Single</div></div>
      <div
        className={`upload-zone${dragOver ? " drag-over" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
        onClick={() => {}}
      >
        <div className="upload-icon">↑</div>
        {file ? (
          <div style={{ color: "var(--accent)", fontWeight: 600 }}>{file.name}</div>
        ) : (
          <>
            <div style={{ fontSize: 14, color: "var(--t2)" }}>Arrastra y suelta tu archivo de audio</div>
            <div className="upload-hint"><b>o explora</b> desde tu computadora</div>
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 8 }}>MP3, WAV, FLAC — máx 200 MB</div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div className="cover-art-box" style={{ flexShrink: 0 }}>
          <span style={{ fontSize: 24 }}>+</span>
          <span>Cover Art</span>
        </div>
        <div style={{ flex: 1 }}>
          <div className="form-group-mb">
            <label className="form-label">Track Title</label>
            <input value={form.title} onChange={set("title")} placeholder="Enter track title" />
          </div>
          <div className="form-group-mb">
            <label className="form-label">Genre</label>
            <select value={form.genre} onChange={set("genre")}>
              <option value="">Select genre</option>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group-mb">
            <label className="form-label">Description</label>
            <textarea value={form.desc} onChange={set("desc")} placeholder="Add a description..." />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button className="btn-primary" onClick={() => { if (!form.title) return; toast("Pista publicada ✓"); }}>Publish Single</button>
      </div>
    </div>
  );
}

export function CreateAlbumPage({ toast }) {
  const [form, setForm] = useState({ title: "", date: "", genre: "" });
  const [tracks, setTracks] = useState([
    { id: 1, name: "Track Title", file: "track_01.mp3", dur: "3:45" },
    { id: 2, name: "Track Title", file: "track_02.mp3", dur: "3:45" },
    { id: 3, name: "Track Title", file: "track_03.mp3", dur: "3:45" },
  ]);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const addTrack = () => setTracks(t => [...t, { id: Date.now(), name: "Nueva Pista", file: `track_0${t.length + 1}.mp3`, dur: "0:00" }]);
  const removeTrack = id => setTracks(t => t.filter(x => x.id !== id));

  return (
    <div className="page-inner">
      <div className="page-header"><div className="page-title">Create Album</div></div>
      <div className="settings-card">
        <div className="settings-card-title">Album Info</div>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div className="cover-art-box" style={{ flexShrink: 0, width: 120, height: 120 }}>
            <span style={{ fontSize: 24 }}>+</span><span>Cover Art</span>
          </div>
          <div style={{ flex: 1 }}>
            <div className="form-group-mb">
              <label className="form-label">Album Title</label>
              <input value={form.title} onChange={set("title")} placeholder="Enter album title" />
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Release Date</label>
                <input type="date" value={form.date} onChange={set("date")} />
              </div>
              <div>
                <label className="form-label">Genre</label>
                <select value={form.genre} onChange={set("genre")}>
                  <option value="">Select genre</option>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="settings-card-title" style={{ marginBottom: 0 }}>TRACKLIST</div>
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={addTrack}>+ Add New Track</button>
        </div>
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "30px 1fr 80px 100px 60px", gap: 12, padding: "8px 12px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 600, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>#</span><span>File / Title</span><span>Duration</span><span>Status</span><span></span>
          </div>
          {tracks.map((t, i) => (
            <div key={t.id} className="tracklist-row">
              <div className="tracklist-num">{i + 1}</div>
              <div className="tracklist-icon"><IcMusic /></div>
              <div className="tracklist-info">
                <div className="tracklist-name">{t.name}</div>
                <div className="tracklist-file">{t.file}</div>
              </div>
              <div className="tracklist-dur">{t.dur}</div>
              <div className="status-badge-pending">Pending</div>
              <button className="remove-btn" onClick={() => removeTrack(t.id)}>✕</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <button className="btn-ghost">Cancelar</button>
        <button className="btn-primary" onClick={() => { if (!form.title) return; toast("Álbum creado ✓"); }}>Publicar Álbum</button>
      </div>
    </div>
  );
}

export function EditTrackPage({ track, setPage, toast }) {
  const t = track || TRACKS[0];
  const [form, setForm] = useState({ title: t.title, genre: t.genre, desc: "Track description text goes here. This field is pre-filled with existing data for the artist to review and edit before saving." });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page-inner">
      <div className="breadcrumb">
        <a onClick={() => setPage("artist-tracks")}>Mis Pistas</a>
        <span>›</span><span>Editar Pista</span>
      </div>
      <div className="page-header"><div className="page-title">Edit Track</div></div>
      <div className="settings-card" style={{ maxWidth: 700 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ flexShrink: 0 }}>
            <div className="cover-art-box" style={{ width: 110, height: 110, borderStyle: "solid" }}>
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)", fontSize: 36 }}><IcMusic /></div>
            </div>
            <button className="btn-ghost" style={{ width: "100%", marginTop: 8, fontSize: 12, padding: "6px" }}>Change</button>
          </div>
          <div style={{ flex: 1 }}>
            <div className="form-group-mb">
              <label className="form-label">Title</label>
              <input value={form.title} onChange={set("title")} />
            </div>
            <div className="form-group-mb">
              <label className="form-label">Genre</label>
              <select value={form.genre} onChange={set("genre")}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group-mb">
              <label className="form-label">Description</label>
              <textarea value={form.desc} onChange={set("desc")} rows={5} maxLength={300} />
              <div className="char-count">{form.desc.length} / 300</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--t3)", marginBottom: 10 }}>FILE INFO</div>
          <table className="file-info-table">
            <thead><tr><th>File</th><th>Format</th><th>Duration</th><th>Uploaded</th></tr></thead>
            <tbody>
              <tr><td><span className="file-name-link">{t.title.toLowerCase().replace(" ", "_")}.mp3</span></td><td>MP3</td><td>{fmtTime(t.duration)}</td><td>Jan 12, 2025</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button className="btn-danger" onClick={() => { toast("Pista eliminada"); setPage("artist-tracks"); }}>✕ Delete Track</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost" onClick={() => setPage("artist-tracks")}>Cancel</button>
            <button className="btn-primary" onClick={() => toast("Cambios guardados ✓")}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArtistAnalyticsPage() {
  return (
    <div className="page-inner">
      <div className="page-header"><div className="page-title">Analíticas</div></div>
      <div className="stat-cards" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat-card"><div className="stat-card-label">Reproducciones Totales</div><div className="stat-card-value">2.3M</div><div className="stat-card-delta">+18.2%</div></div>
        <div className="stat-card"><div className="stat-card-label">Oyentes Únicos</div><div className="stat-card-value">84K</div><div className="stat-card-delta">+9.4%</div></div>
        <div className="stat-card"><div className="stat-card-label">Seguidores</div><div className="stat-card-value">12.4K</div><div className="stat-card-delta">+3.1%</div></div>
      </div>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r12)", padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--t1)", marginBottom: 16 }}>Reproducciones Mensuales</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trafficData}>
            <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E8960A" stopOpacity={0.3}/><stop offset="95%" stopColor="#E8960A" stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="m" stroke="var(--t3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--t3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke="#E8960A" fill="url(#ag)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}