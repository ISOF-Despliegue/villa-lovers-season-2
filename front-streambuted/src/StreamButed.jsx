// StreamButed.jsx ─ Frontend completo (Electron + React + TypeScript compatible)
// Renombrar a StreamButed.tsx y agregar anotaciones de tipo según necesidad.
// Requiere: react, recharts (npm install recharts)

import { useState, useRef, useEffect, useCallback } from "react";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import './index.css';
import { COLORS_PIE, GENRES, fmtTime, fmtNum, ARTISTS, TRACKS, ALBUMS, USERS_MOCK, FLAGGED_MOCK,  
  ACTIVITY, trafficData, usersData, pieData } from './data/mockData';
import { IcHome, IcSearch, IcLib, IcSettings, IcUpload, IcChart, IcUsers, IcShield, IcPlay, IcPause, 
  IcSkipBack, IcSkipFwd, IcShuffle, IcRepeat, IcVolume, IcHeart, IcChevron, IcX, IcCheck, IcMusic, IcOverview, 
  IcContent, IcReport, IcDashboard, IcTracks } from './components/icons/Icons';

import { AlbumCard } from './components/ui/AlbumCard';
import { TrackRow } from './components/ui/TrackRow';
import { ProgressBar } from './components/ui/ProgressBar';
import { Toast } from './components/ui/Toast';

import { BottomPlayer } from './components/layout/BottomPlayer';
import { ExpandedPlayer } from './components/layout/ExpandedPlayer';
import { ListenerSidebar, ArtistSidebar, AdminSidebar } from './components/layout/Sidebars';

import { LoginPage, RegisterPage } from './pages/AuthPages';
import { SettingsPage } from './pages/SettingsPage';

import { HomePage, SearchPage, AlbumDetailPage, ArtistProfilePage } from './pages/listener/ListenerPages';
import { ArtistDashboardPage, MyTracksPage, UploadSinglePage, CreateAlbumPage, EditTrackPage, ArtistAnalyticsPage } from './pages/artist/ArtistPages';
import { AdminOverviewPage, AdminUsersPage, AdminModerationPage } from './pages/admin/AdminPages';

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function StreamButed() {

  // Auth state
  const [authPage, setAuthPage] = useState("login"); // login | register
  const [user, setUser] = useState(null);

  // App navigation
  const [page, setPage] = useState("home");
  const [viewAlbum, setViewAlbum] = useState(null);
  const [viewArtist, setViewArtist] = useState(null);
  const [editTrack, setEditTrack] = useState(null);

  // Player state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(72);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [expandedPlayer, setExpandedPlayer] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState(null);
  const toast = useCallback((msg) => setToastMsg(msg), []);

  // Simulate progress
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= currentTrack.duration) {
          setIsPlaying(false);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, currentTrack]);

  const playTrack = useCallback((t) => {
    setCurrentTrack(t); setIsPlaying(true); setProgress(0);
  }, []);

  const handleNext = () => {
    const i = TRACKS.findIndex(t => t.id === currentTrack?.id);
    if (i < TRACKS.length - 1) playTrack(TRACKS[i + 1]);
  };

  const handlePrev = () => {
    if (progress > 5) { setProgress(0); return; }
    const i = TRACKS.findIndex(t => t.id === currentTrack?.id);
    if (i > 0) playTrack(TRACKS[i - 1]);
  };

  const handleLogin = (u) => { setUser(u); setPage(u.role === "admin" ? "admin-overview" : u.role === "artist" ? "artist-dashboard" : "home"); };

  if (!user) {
    if (authPage === "login") return <LoginPage onLogin={handleLogin} onRegister={() => setAuthPage("register")} />;
    return <RegisterPage onLogin={handleLogin} onBack={() => setAuthPage("login")} />;
  }

  // Admin shell
  if (user.role === "admin") {
    const adminPages = {
      "admin-overview": <AdminOverviewPage />,
      "admin-users": <AdminUsersPage toast={toast} />,
      "admin-content": <div className="page-inner"><div className="page-title">Contenido</div><div className="empty-state"><div className="empty-icon">📁</div><div className="empty-text">Gestión de Contenido</div></div></div>,
      "admin-reports": <div className="page-inner"><div className="page-title">Reportes</div><div className="empty-state"><div className="empty-icon">📊</div><div className="empty-text">Reportes del Sistema</div></div></div>,
      "admin-moderation": <AdminModerationPage toast={toast} />,
      "settings": <SettingsPage user={user} toast={toast} />,
    };
    return (
      <div className="app-shell">
        {expandedPlayer && currentTrack && (
          <ExpandedPlayer track={currentTrack} queue={TRACKS} isPlaying={isPlaying}
            onToggle={() => setIsPlaying(p => !p)} onClose={() => setExpandedPlayer(false)}
            progress={progress} setProgress={setProgress} volume={volume} setVolume={setVolume}
            shuffle={shuffle} setShuffle={setShuffle} repeat={repeat} setRepeat={setRepeat}
            onNext={handleNext} onPrev={handlePrev} onSelectTrack={playTrack} />
        )}
        <div className="app-body">
          <AdminSidebar page={page} setPage={setPage} user={user} />
          <div className="main-content">{adminPages[page] || adminPages["admin-overview"]}</div>
        </div>
        {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}
      </div>
    );
  }

  // Artist shell
  if (user.role === "artist") {
    const artistPages = {
      "artist-dashboard": <ArtistDashboardPage user={user} onPlayTrack={playTrack} currentTrack={currentTrack} setPage={setPage} />,
      "artist-tracks": <MyTracksPage setPage={setPage} setEditTrack={setEditTrack} toast={toast} />,
      "artist-upload": <UploadSinglePage toast={toast} />,
      "artist-album": <CreateAlbumPage toast={toast} />,
      "artist-edit-track": <EditTrackPage track={editTrack} setPage={setPage} toast={toast} />,
      "artist-analytics": <ArtistAnalyticsPage />,
      "settings": <SettingsPage user={user} toast={toast} />,
      // Listener pages (artist can also listen)
      "search": <SearchPage onPlayTrack={playTrack} currentTrack={currentTrack} setPage={setPage} setViewAlbum={setViewAlbum} setViewArtist={setViewArtist} />,
      "album-detail": <AlbumDetailPage albumId={viewAlbum} onPlayTrack={playTrack} currentTrack={currentTrack} setPage={setPage} setViewArtist={setViewArtist} />,
      "artist-profile": <ArtistProfilePage artistId={viewArtist} onPlayTrack={playTrack} currentTrack={currentTrack} setPage={setPage} setViewAlbum={setViewAlbum} />,
    };
    return (
      <div className="app-shell">
        {expandedPlayer && currentTrack && (
          <ExpandedPlayer track={currentTrack} queue={TRACKS} isPlaying={isPlaying}
            onToggle={() => setIsPlaying(p => !p)} onClose={() => setExpandedPlayer(false)}
            progress={progress} setProgress={setProgress} volume={volume} setVolume={setVolume}
            shuffle={shuffle} setShuffle={setShuffle} repeat={repeat} setRepeat={setRepeat}
            onNext={handleNext} onPrev={handlePrev} onSelectTrack={playTrack} />
        )}
        <div className="app-body">
          <ArtistSidebar page={page} setPage={setPage} user={user} />
          <div className="main-content">{artistPages[page] || artistPages["artist-dashboard"]}</div>
        </div>
        <BottomPlayer track={currentTrack} isPlaying={isPlaying} onToggle={() => setIsPlaying(p => !p)}
          onExpand={() => setExpandedPlayer(true)} progress={progress} setProgress={setProgress}
          volume={volume} setVolume={setVolume} shuffle={shuffle} setShuffle={setShuffle}
          repeat={repeat} setRepeat={setRepeat} onNext={handleNext} onPrev={handlePrev} />
        {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}
      </div>
    );
  }

  // Listener shell (default)
  const listenerPages = {
    "home": <HomePage onPlayTrack={playTrack} currentTrack={currentTrack} setPage={setPage} setViewAlbum={setViewAlbum} setViewArtist={setViewArtist} />,
    "search": <SearchPage onPlayTrack={playTrack} currentTrack={currentTrack} setPage={setPage} setViewAlbum={setViewAlbum} setViewArtist={setViewArtist} />,
    "library": <div className="page-inner"><div className="page-title">Biblioteca</div><div className="empty-state"><div className="empty-icon">🎵</div><div className="empty-text">Tu biblioteca está vacía</div><div className="empty-sub">Guarda álbumes y pistas para verlos aquí</div></div></div>,
    "album-detail": <AlbumDetailPage albumId={viewAlbum} onPlayTrack={playTrack} currentTrack={currentTrack} setPage={setPage} setViewArtist={setViewArtist} />,
    "artist-profile": <ArtistProfilePage artistId={viewArtist} onPlayTrack={playTrack} currentTrack={currentTrack} setPage={setPage} setViewAlbum={setViewAlbum} />,
    "settings": <SettingsPage user={user} toast={toast} />,
  };

  return (
    <div className="app-shell">
      {expandedPlayer && currentTrack && (
        <ExpandedPlayer track={currentTrack} queue={TRACKS} isPlaying={isPlaying}
          onToggle={() => setIsPlaying(p => !p)} onClose={() => setExpandedPlayer(false)}
          progress={progress} setProgress={setProgress} volume={volume} setVolume={setVolume}
          shuffle={shuffle} setShuffle={setShuffle} repeat={repeat} setRepeat={setRepeat}
          onNext={handleNext} onPrev={handlePrev} onSelectTrack={playTrack} />
      )}
      <div className="app-body">
        <ListenerSidebar page={page} setPage={setPage} user={user} />
        <div className="main-content">{listenerPages[page] || listenerPages["home"]}</div>
      </div>
      <BottomPlayer track={currentTrack} isPlaying={isPlaying} onToggle={() => setIsPlaying(p => !p)}
        onExpand={() => setExpandedPlayer(true)} progress={progress} setProgress={setProgress}
        volume={volume} setVolume={setVolume} shuffle={shuffle} setShuffle={setShuffle}
        repeat={repeat} setRepeat={setRepeat} onNext={handleNext} onPrev={handlePrev} />
      {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}
    </div>
  );
}
