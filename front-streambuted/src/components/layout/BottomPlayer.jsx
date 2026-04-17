import { IcMusic, IcHeart, IcShuffle, IcSkipBack, IcPlay, IcPause, IcSkipFwd, IcRepeat, IcVolume } from '../icons/Icons';
import { fmtTime } from '../../data/mockData';
import { ProgressBar } from '../ui/ProgressBar';

export function BottomPlayer({ track, isPlaying, onToggle, onExpand, progress, setProgress, volume, setVolume, shuffle, setShuffle, repeat, setRepeat, onNext, onPrev }) {
  if (!track) return (
    <div className="bottom-player">
      <div className="player-track" style={{ color: "var(--t3)", fontSize: 13 }}>
        <div className="player-cover"><IcMusic /></div>
        <span>Selecciona una pista...</span>
      </div>
    </div>
  );

  return (
    <div className="bottom-player">
      <div className="player-track">
        <div className="player-cover" onClick={onExpand}>
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: 20 }}><IcMusic /></div>
        </div>
        <div className="player-track-info">
          <div className="player-track-name" onClick={onExpand}>{track.title}</div>
          <div className="player-track-artist">{track.artist}</div>
        </div>
        <button className="btn-icon" style={{ marginLeft: 8 }}><IcHeart /></button>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className={`btn-icon${shuffle ? " active" : ""}`} onClick={() => setShuffle(s => !s)}><IcShuffle /></button>
          <button className="btn-icon" onClick={onPrev}><IcSkipBack /></button>
          <button className="play-btn" onClick={onToggle}>{isPlaying ? <IcPause /> : <IcPlay />}</button>
          <button className="btn-icon" onClick={onNext}><IcSkipFwd /></button>
          <button className={`btn-icon${repeat ? " active" : ""}`} onClick={() => setRepeat(r => !r)}><IcRepeat /></button>
        </div>
        <div className="player-progress">
          <span className="progress-time">{fmtTime(progress)}</span>
          <ProgressBar value={progress} max={track.duration} onChange={setProgress} />
          <span className="progress-time right">{fmtTime(track.duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <button className="btn-icon"><IcVolume /></button>
        <div className="volume-bar" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100));
        }}>
          <div className="volume-fill" style={{ width: `${volume}%` }} />
        </div>
      </div>
    </div>
  );
}