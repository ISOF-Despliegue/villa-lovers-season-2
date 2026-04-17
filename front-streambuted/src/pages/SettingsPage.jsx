import { useState } from "react";

export function SettingsPage({ user, toast }) {
  const [username, setUsername] = useState(user.name);
  const [bio, setBio] = useState("");
  return (
    <div className="page-inner">
      <div className="page-header"><div className="page-title">User Settings</div></div>
      <div className="settings-card" style={{ maxWidth: 600 }}>
        <div className="settings-card-title">Perfil</div>
        <div className="avatar-upload-row">
          <div className="avatar-upload-img">{user.name[0]?.toUpperCase()}</div>
          <div>
            <button className="btn-ghost" style={{ fontSize: 13 }}>↑ Subir foto</button>
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 6 }}>JPG o PNG. Max 5 MB.</div>
          </div>
        </div>
        <div className="form-group-mb">
          <label className="form-label">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
        </div>
        <div className="form-group-mb">
          <label className="form-label">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself" rows={4} />
          <div className="char-count">{bio.length} / 300</div>
        </div>
        <button className="btn-primary" onClick={() => toast("Cambios guardados ✓")}>Guardar Cambios</button>
      </div>
    </div>
  );
}