import { IcChevron, IcMusic, IcShuffle, IcSkipBack, IcPlay, IcPause, IcSkipFwd, IcRepeat, IcVolume } from '../icons/Icons';
import { fmtTime } from '../../data/mockData';
import { ProgressBar } from '../ui/ProgressBar';

export function ExpandedPlayer({ track, queue, isPlaying, onToggle, onClose, progress, setProgress, volume, setVolume, shuffle, setShuffle, repeat, setRepeat, onNext, onPrev, onSelectTrack }) {
  if (!track) return null;
  return (
    <div className="expanded-player-overlay">
      <div className="ep-main">
        <button className="ep-close" onClick={onClose}><IcChevron dir="down" /></button>
        <div style={{ fontSize: 12, color: "var(--t3)", marginBottom: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>Now Playing</div>
        <div className="ep-cover">
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: 64 }}><IcMusic /></div>
        </div>
        <div className="ep-meta">
          <div className="ep-title">{track.title}</div>
          <div className="ep-artist">{track.artist}</div>
        </div>
        <div className="ep-progress">
          <div className="player-progress" style={{ width: "100%" }}>
            <span className="progress-time">{fmtTime(progress)}</span>
            <ProgressBar value={progress} max={track.duration} onChange={setProgress} />
            <span className="progress-time right">{fmtTime(track.duration)}</span>
          </div>
        </div>
        <div className="ep-controls">
          <button className={`btn-icon${shuffle ? " active" : ""}`} onClick={() => setShuffle(s => !s)}><IcShuffle /></button>
          <button className="btn-icon" onClick={onPrev}><IcSkipBack /></button>
          <button className="ep-play-btn" onClick={onToggle}>{isPlaying ? <IcPause /> : <IcPlay />}</button>
          <button className="btn-icon" onClick={onNext}><IcSkipFwd /></button>
          <button className={`btn-icon${repeat ? " active" : ""}`} onClick={() => setRepeat(r => !r)}><IcRepeat /></button>
        </div>
        <div className="ep-vol">
          <button className="btn-icon"><IcVolume /></button>
          <div className="volume-bar" style={{ flex: 1 }} onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100));
          }}>
            <div className="volume-fill" style={{ width: `${volume}%` }} />
          </div>
        </div>
      </div>

      <div className="ep-sidebar">
        <div className="ep-sidebar-title">En Cola</div>
        {queue.map((t) => (
          <div key={t.id} className={`queue-item${t.id === track.id ? " active" : ""}`} onClick={() => onSelectTrack(t)}>
            <div className="queue-thumb"><div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)", fontSize: 12 }}><IcMusic /></div></div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="queue-name">{t.title}</div>
              <div className="queue-artist">{t.artist}</div>
            </div>
            <div className="queue-dur">{fmtTime(t.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}