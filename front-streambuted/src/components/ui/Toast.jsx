import { useEffect } from 'react';

export function Toast({ msg, onDone }) {
  useEffect(() => { 
    const t = setTimeout(onDone, 2200); 
    return () => clearTimeout(t); 
  }, [onDone]);
  
  return <div className="toaster">{msg}</div>;
}