/**
 * Embed layout — opts OUT of the root layout (no <html>/<body> from root).
 * Next.js App Router: a segment-level layout.tsx replaces the parent layout
 * only if it returns its own <html> tag. Since this is a nested route, we
 * need to keep the root layout's <html>/<body> but strip all chrome.
 *
 * Strategy: Keep the root layout's shell but render nothing extra here.
 * The embed page itself is a clean React subtree with no header/footer.
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="embed-shell">
      {children}
    </div>
  );
}
