'use client';

/* START HERE. What the product does, one labelled illustration of its output, and the choice of
 * view. Opens by itself on `/` unless the visitor turned it off or `?welcome=0` is present.
 * Closing or choosing never turns it off; the checkbox does. */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteView, type SiteView } from './SiteViewProvider';

export interface WelcomeCopy {
  name: string;
  mark: ReactNode;
  eyebrow: string;
  question: string;
  explain: string;
  illustration: { head: string; before: string; answer: string; tag: string; after: string };
}

export default function Welcome({ copy }: { copy: WelcomeCopy }) {
  const mode = useSiteView();
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previous = useRef<HTMLElement | null>(null);
  const [off, setOff] = useState(false);
  const [visible, setVisible] = useState(false);
  const offKey = mode?.keys.welcomeOff;
  const eventName = mode?.keys.event;

  const readOff = useCallback(() => {
    try {
      return offKey ? localStorage.getItem(offKey) === '1' : false;
    } catch {
      return false;
    }
  }, [offKey]);

  const show = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOff(readOff());
    const el = dialog.current;
    if (!el) return;
    if (!el.open) {
      previous.current = document.activeElement as HTMLElement | null;
      el.showModal();
    }
    requestAnimationFrame(() => setVisible(true));
  }, [readOff]);

  const close = useCallback(() => {
    setVisible(false);
    if (timer.current) clearTimeout(timer.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(() => {
      dialog.current?.close();
      const back = previous.current;
      if (back && back.isConnected && back !== document.body) back.focus();
      else document.querySelector<HTMLElement>('#start button, #start input, .sv-nav a')?.focus({ preventScroll: true });
    }, reduced ? 0 : 220);
  }, []);

  useEffect(() => {
    if (!eventName) return;
    const q = new URLSearchParams(window.location.search);
    // The dialog opens from browser-only facts (storage and the URL), so it opens after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (path === '/' && !readOff() && q.get('welcome') !== '0') show();
    window.addEventListener(eventName, show);
    return () => {
      window.removeEventListener(eventName, show);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [path, show, readOff, eventName]);

  function select(view: SiteView) {
    mode?.choose(view);
    close();
  }

  return (
    <dialog
      ref={dialog}
      className="sv-welcome"
      data-visible={visible}
      aria-labelledby="sv-welcome-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <header className="sv-welcome-top">
        <span className="sv-brand">
          <span className="sv-mark">{copy.mark}</span>
          {copy.name} <small>/ START HERE</small>
        </span>
        <button type="button" aria-label="Close welcome" onClick={close} autoFocus>
          ×
        </button>
      </header>
      <div className="sv-welcome-intro">
        <span className="sv-eyebrow">{copy.eyebrow}</span>
        <h2 id="sv-welcome-title">{copy.question}</h2>
        <p>{copy.explain}</p>
      </div>
      <section className="sv-illustration" aria-label="Illustration of the output">
        <div>
          <span>{copy.illustration.head}</span>
          <span>ILLUSTRATION</span>
        </div>
        <p>{copy.illustration.before}</p>
        <p className="sv-illustration-answer">
          {copy.illustration.answer}
          <strong>{copy.illustration.tag}</strong>
        </p>
        <p>{copy.illustration.after}</p>
      </section>
      <section className="sv-welcome-choose">
        <div>
          <h3>How would you like to explore?</h3>
          <p>You can switch anytime.</p>
        </div>
        <div className="sv-choices">
          <button type="button" onClick={() => select('console')}>
            <span>
              ▦ <b>Console</b>
              <span aria-hidden="true">↗</span>
            </span>
            <strong>See more at once.</strong>
            <span>This layout puts more data and controls on screen.</span>
          </button>
          <button type="button" onClick={() => select('simple')}>
            <span>
              ☰ <b>Simple</b>
              <span aria-hidden="true">↗</span>
            </span>
            <strong>Start with the essentials.</strong>
            <span>This overview gives you more room and lets you open details as you go.</span>
          </button>
        </div>
      </section>
      <footer>
        <label>
          <input
            type="checkbox"
            checked={off}
            onChange={(e) => {
              const value = e.target.checked;
              setOff(value);
              try {
                if (offKey && value) localStorage.setItem(offKey, '1');
                else if (offKey) localStorage.removeItem(offKey);
              } catch {
                /* storage blocked: the choice lasts this visit */
              }
            }}
          />
          Don&rsquo;t open this when I come back
        </label>
      </footer>
    </dialog>
  );
}
