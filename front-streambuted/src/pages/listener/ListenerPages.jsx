import { useState } from "react";
import { IcMusic, IcSearch, IcPlay, IcHeart } from "../../components/icons/Icons";
import { ALBUMS, TRACKS, ARTISTS, fmtNum, fmtTime } from "../../data/mockData";
import { AlbumCard } from "../../components/ui/AlbumCard";
import { TrackRow } from "../../components/ui/TrackRow";

export function HomePage({ onPlayTrack, currentTrack, setPage, setViewAlbum, setViewArtist }) {
  return (
    <div className="page-inner">
      <div className="page-header">
        <div className="page-title">Home</div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Trending Albums</div>
          <button className="see-all-btn">See all</button>
        </div>
        <div className="album-grid">
          {ALBUMS.map(al => <AlbumCard key={al.id} album={al} onClick={() => { setViewAlbum(al.id); setPage("album-detail"); }} />)}
          {ALBUMS.map(al => <AlbumCard key={al.id + "x"} album={{ ...al, title: al.title + " (Deluxe)" }} onClick={() => { setViewAlbum(al.id); setPage("album-detail"); }} />)}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Popular Singles</div>
          <button className="see-all-btn">See all</button>
        </div>
        <div className="album-grid">
          {TRACKS.slice(0, 6).map(t => (
            <div key={t.id} className="album-card" onClick={() => onPlayTrack(t)}>
              <div className="album-thumb">
                <div style={{ fontSize: 28, color: "var(--t3)" }}><IcMusic /></div>
                <div className="play-overlay" style={{ color: "#fff", fontSize: 32 }}>▶</div>
              </div>
              <div className="album-card-title">{t.title}</div>
              <div className="album-card-artist">{t.artist}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchPage({ onPlayTrack, currentTrack, setPage, setViewAlbum, setViewArtist }) {
  const [q, setQ] = useState("");

  const filtered = q.trim()
    ? { tracks: TRACKS.filter(t => t.title.toLowerCase().includes(q.toLowerCase()) || t.artist.toLowerCase().includes(q.toLowerCase())),
        albums: ALBUMS.filter(a => a.title.toLowerCase().includes(q.toLowerCase()) || a.artist.toLowerCase().includes(q.toLowerCase())) }
    : { tracks: TRACKS, albums: ALBUMS };

  return (
    <div>
      <div className="search-header">
        <div className="search-input-wrap">
          <span className="search-icon"><IcSearch /></span>
          <input type="text" placeholder="Busca canciones, artistas, álbumes..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>
      <div className="page-inner" style={{ paddingTop: 24 }}>
        <div className="section">
          <div className="section-header">
            <div className="section-title">Top Songs</div>
            <button className="see-all-btn">See all</button>
          </div>
          <table className="track-list" style={{ width: "100%" }}>
            <thead><tr>
              <th style={{ width: 40 }}>#</th>
              <th>Título</th>
              <th>Reproducciones</th>
              <th style={{ textAlign: "right" }}>Duración</th>
            </tr></thead>
            <tbody>
              {filtered.tracks.slice(0, 7).map((t, i) => (
                <TrackRow key={t.id} track={t} index={i} isPlaying={currentTrack?.id === t.id} onPlay={() => onPlayTrack(t)}
                  onArtistClick={id => { setViewArtist(id); setPage("artist-profile"); }} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-title">Álbumes</div>
            <button className="see-all-btn">See all</button>
          </div>
          <div className="album-grid">
            {filtered.albums.map(al => <AlbumCard key={al.id} album={al} onClick={() => { setViewAlbum(al.id); setPage("album-detail"); }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlbumDetailPage({ albumId, onPlayTrack, currentTrack, setPage, setViewArtist }) {
  const album = ALBUMS.find(a => a.id === albumId) || ALBUMS[0];
  const tracks = TRACKS.filter(t => album.trackIds.includes(t.id));

  return (
    <div>
      <div className="album-hero">
        <div className="album-hero-cover">
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: 56 }}><IcMusic /></div>
        </div>
        <div className="album-hero-info">
          <div className="album-hero-type">Álbum</div>
          <div className="album-hero-title">{album.title}</div>
          <div className="album-hero-meta">
            <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => { setViewArtist(album.artistId); setPage("artist-profile"); }}>{album.artist}</span>
            <span className="dot-sep" />
            <span>{album.year}</span>
            <span className="dot-sep" />
            <span>{tracks.length} pistas</span>
          </div>
          <div className="album-actions">
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={() => tracks[0] && onPlayTrack(tracks[0])}>
              <IcPlay />Play
            </button>
            <button className="btn-ghost"><IcHeart /></button>
          </div>
        </div>
      </div>
      <div className="track-table-wrap">
        <table className="track-list">
          <thead><tr>
            <th style={{ width: 40 }}>#</th>
            <th>Título</th>
            <th>Reproducciones</th>
            <th style={{ textAlign: "right" }}>Duración</th>
          </tr></thead>
          <tbody>
            {tracks.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} isPlaying={currentTrack?.id === t.id} onPlay={() => onPlayTrack(t)}
                onArtistClick={id => { setViewArtist(id); setPage("artist-profile"); }} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ArtistProfilePage({ artistId, onPlayTrack, currentTrack, setPage, setViewAlbum }) {
  const artist = ARTISTS.find(a => a.id === artistId) || ARTISTS[0];
  const tracks = TRACKS.filter(t => t.artistId === artist.id);
  const albums = ALBUMS.filter(a => a.artistId === artist.id);
  const [following, setFollowing] = useState(false);

  return (
    <div>
      <div className="artist-banner">
        <div className="artist-banner-gradient" />
      </div>
      <div className="artist-info-row">
        <div className="artist-avatar-lg">{artist.initials}</div>
        <div>
          <div style={{ fontSize: 12, color: "var(--t3)", marginBottom: 4 }}>Artista</div>
          <div className="artist-name-lg">{artist.name}</div>
          <div className="artist-stats">{fmtNum(artist.followers)} seguidores</div>
        </div>
        <button className={`follow-btn${following ? " following" : ""}`} onClick={() => setFollowing(f => !f)}>
          {following ? "✓ Siguiendo" : "+ Seguir"}
        </button>
      </div>

      <div style={{ padding: "0 32px 40px" }}>
        <div className="section">
          <div className="section-title" style={{ marginBottom: 16 }}>Popular Tracks</div>
          <table className="track-list">
            <thead><tr>
              <th style={{ width: 40 }}>#</th>
              <th>Título</th>
              <th>Reproducciones</th>
              <th style={{ textAlign: "right" }}>Duración</th>
            </tr></thead>
            <tbody>
              {tracks.slice(0, 5).map((t, i) => (
                <TrackRow key={t.id} track={t} index={i} isPlaying={currentTrack?.id === t.id} onPlay={() => onPlayTrack(t)} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-title">Discografía</div>
            <button className="see-all-btn">See all</button>
          </div>
          <div className="album-grid">
            {albums.map(al => <AlbumCard key={al.id} album={al} onClick={() => { setViewAlbum(al.id); setPage("album-detail"); }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}