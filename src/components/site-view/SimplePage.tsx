import type { ReactNode } from 'react';

/** A Simple reading page: a small label, a large title, one intro paragraph, then the content. */
export default function SimplePage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="sv-page">
      <header className="sv-page-heading">
        <span className="sv-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {intro ? <div className="sv-page-intro">{intro}</div> : null}
      </header>
      {children}
    </div>
  );
}
