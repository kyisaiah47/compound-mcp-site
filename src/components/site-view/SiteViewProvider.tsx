'use client';

/* WHICH VIEW THIS VISITOR IS READING: Console or Simple.
 *
 * Console is the clean-visitor default. A valid `?view=simple|console` wins over the saved
 * choice, and a valid explicit choice is saved. Only the two preferences reach localStorage;
 * drafts and picks live in the in-memory map below, so a view switch never loses them. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { usePathname } from 'next/navigation';

export type SiteView = 'console' | 'simple';

interface ViewContext {
  view: SiteView;
  choose: (view: SiteView) => void;
  welcome: () => void;
  keys: { view: string; welcomeOff: string; event: string };
}

const Context = createContext<ViewContext | null>(null);
const Memory = createContext<Map<string, unknown> | null>(null);

export function useSiteView() {
  return useContext(Context);
}

/** State that survives a view switch and a client route change, and never reaches storage. */
export function useViewState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const memory = useContext(Memory);
  const [value, setValue] = useState<T>(() => (memory?.has(key) ? (memory.get(key) as T) : initial));
  const update: Dispatch<SetStateAction<T>> = useCallback(
    (next) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(previous) : next;
        memory?.set(key, resolved);
        return resolved;
      });
    },
    [key, memory],
  );
  return [value, update];
}

export default function SiteViewProvider({
  slug,
  welcome,
  children,
}: {
  /** The storage prefix: `<slug>:view` and `<slug>:welcome-off`. */
  slug: string;
  welcome: ReactNode;
  children: ReactNode;
}) {
  const keys = { view: `${slug}:view`, welcomeOff: `${slug}:welcome-off`, event: `${slug}:welcome` };
  const [view, setView] = useState<SiteView>('console');
  const [memory] = useState(() => new Map<string, unknown>());
  const path = usePathname();

  const choose = useCallback(
    (next: SiteView) => {
      setView(next);
      try {
        localStorage.setItem(`${slug}:view`, next);
      } catch {
        /* a blocked store never breaks the switch */
      }
      const url = new URL(window.location.href);
      if (url.searchParams.has('view')) {
        url.searchParams.set('view', next);
        window.history.replaceState(window.history.state, '', url.href);
      }
    },
    [slug],
  );

  useEffect(() => {
    const explicit = new URLSearchParams(window.location.search).get('view');
    let saved: SiteView = 'console';
    try {
      saved = localStorage.getItem(`${slug}:view`) === 'simple' ? 'simple' : 'console';
    } catch {
      /* storage blocked: Console */
    }
    /* The URL and localStorage are unknown during the server render, so the view is read after
     * mount. Console renders until then. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (explicit === 'simple' || explicit === 'console') choose(explicit);
    else setView(saved);
  }, [path, choose, slug]);

  useEffect(() => {
    document.documentElement.dataset.view = view;
  }, [view]);

  const welcomeOpen = useCallback(() => window.dispatchEvent(new Event(`${slug}:welcome`)), [slug]);

  return (
    <Context.Provider value={{ view, choose, welcome: welcomeOpen, keys }}>
      <Memory.Provider value={memory}>
        <div className="site-surface" data-view={view}>
          {children}
        </div>
        {welcome}
      </Memory.Provider>
    </Context.Provider>
  );
}
