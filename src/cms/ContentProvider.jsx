import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cmsEnabled, previewMode } from './client';
import { listEntries } from './api';
import { postFromEntry, toyFromEntry } from './model';
import { works, toys } from '../content';

const Context = createContext();
export function ContentProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(cmsEnabled);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    if (!cmsEnabled) return;
    try { setEntries(await listEntries()); setError(''); }
    catch { setError('We couldn’t load the latest studio updates. Please try again.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    refresh();
    const focus = () => { if (!document.hidden) refresh(); };
    window.addEventListener('focus', focus);
    document.addEventListener('visibilitychange', focus);
    const timer = setInterval(focus, 240000);
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('nascere-content') : null;
    if (channel) channel.onmessage = refresh;
    return () => { window.removeEventListener('focus', focus); document.removeEventListener('visibilitychange', focus); clearInterval(timer); channel?.close(); };
  }, [refresh]);
  const value = {
    posts: cmsEnabled ? entries.filter(e => e.kind === 'post').map(postFromEntry) : works,
    toys: cmsEnabled ? entries.filter(e => e.kind === 'toy').map(toyFromEntry) : toys,
    memories: entries.filter(e => e.kind === 'memory'), loading, error, refresh, managed: cmsEnabled, previewMode,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useContent = () => useContext(Context);
export function ContentState({ empty, children = 'More studio stories are on their way.' }) {
  const { loading, error, refresh } = useContent();
  if (loading) return <p className="content-state" role="status">A little moment…</p>;
  if (error) return <div className="content-state" role="alert"><p>{error}</p><button className="button" onClick={refresh}>Try again</button></div>;
  if (empty) return <p className="content-state">{children}</p>;
  return null;
}
