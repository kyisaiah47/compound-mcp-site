'use client';

import { useId, useState } from 'react';

/* A command or config a reader copies. Shown at 16px; a clipboard refusal is said in words. */
export default function CopyCommand({ command, label, multiline = false }: { command: string; label: string; multiline?: boolean }) {
  const id = useId();
  const [state, setState] = useState<'idle' | 'copied' | 'refused'>('idle');
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setState('copied');
    } catch {
      setState('refused');
    }
  }
  return (
    <div className="sv-copy">
      <label className="sv-label" htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} className="sv-command" readOnly value={command} spellCheck={false} rows={command.split('\n').length} />
      ) : (
        <input id={id} className="sv-command" readOnly value={command} spellCheck={false} />
      )}
      <button type="button" className="sv-primary" onClick={copy}>
        {state === 'copied' ? 'Copied' : 'Copy'}
      </button>
      <p className="sv-copy-status" role="status" aria-live="polite">
        {state === 'refused' ? 'This browser blocked the clipboard. Select the text above and copy it.' : ''}
      </p>
    </div>
  );
}
