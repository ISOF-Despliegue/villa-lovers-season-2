import { IcMusic } from '../icons/Icons';
import { fmtNum, fmtTime } from '../../data/mockData';

export function TrackRow({ track, index, isPlaying, onPlay, onArtistClick }) {
  return (
    <tr className={`track-row${isPlaying ? " playing" : ""}`} onClick={onPlay}>
      <td><span className="track-num">{isPlaying ? "♫" : index + 1}</span></td>
      <td>
        <div className="track-title-cell">
          <div className="track-thumb"><div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)" }}><IcMusic /></div></div>
          <div>
            <div className="track-name">{track.title}</div>
            <div className="track-artist-link" onClick={e => { e.stopPropagation(); onArtistClick && onArtistClick(track.artistId); }}>{track.artist}</div>
          </div>
        </div>
      </td>
      <td style={{ color: "var(--t3)", fontSize: 13 }}>{fmtNum(track.plays)}</td>
      <td><span className="track-duration">{fmtTime(track.duration)}</span></td>
    </tr>
  );
}