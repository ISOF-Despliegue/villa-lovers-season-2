import { useRef } from 'react';

export function ProgressBar({ value, max, onChange, style }) {
  const ref = useRef();
  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    onChange && onChange(Math.round(pct * max));
  };
  return (
    <div className="progress-bar" ref={ref} onClick={handleClick} style={style}>
      <div className="progress-fill" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  );
}