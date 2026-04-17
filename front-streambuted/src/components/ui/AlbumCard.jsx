import { IcMusic } from '../icons/Icons';

export function AlbumCard({ album, onClick }) {
  return (
    <div className="album-card" onClick={onClick}>
      <div className="album-thumb">
        <div style={{ fontSize: 28, color: "var(--t3)" }}><IcMusic /></div>
        <div className="play-overlay" style={{ color: "#fff", fontSize: 32 }}>▶</div>
      </div>
      <div className="album-card-title">{album.title}</div>
      <div className="album-card-artist">{album.artist}</div>
    </div>
  );
}