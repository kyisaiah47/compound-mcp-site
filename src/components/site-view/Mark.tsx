/* eslint-disable @next/next/no-img-element */
/** The product's own mark, the drawing the browser tab uses. */
export default function Mark({ size = 24 }: { size?: number }) {
  return <img src="/icon.svg" alt="" width={size} height={size} />;
}
