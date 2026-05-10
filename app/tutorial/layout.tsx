const tutorialStyles = `
.btn-sweep-l {
  border-radius: 9999px;
  font-weight: 700;
  color: white;
  background: linear-gradient(to right, #0c4a6e 50%, #0369a1 50%);
  background-size: 200% 100%;
  background-position: right center;
  transition: background-position 0.35s ease;
  display: inline-flex;
  align-items: center;
}
.btn-sweep-l:hover { background-position: left center; }

.nav-card-label { font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem; transition: color 0.2s; }
.nav-card-title  { font-size: 0.875rem; font-weight: 700; color: #374151; transition: color 0.2s; }

.nav-card-next {
  border-radius: 1rem;
  background: linear-gradient(to right, #0369a1 50%, #ffffff 50%);
  background-size: 200% 100%;
  background-position: right center;
  border: 1.5px solid #0369a1;
  transition: background-position 0.35s ease, color 0.2s ease;
  color: #374151;
}
.nav-card-next:hover { background-position: left center; color: white; }
.nav-card-next:hover .nav-card-label,
.nav-card-next:hover .nav-card-title { color: white; }

.nav-card-prev {
  border-radius: 1rem;
  background: linear-gradient(to left, #0369a1 50%, #ffffff 50%);
  background-size: 200% 100%;
  background-position: left center;
  border: 1.5px solid #0369a1;
  transition: background-position 0.35s ease, color 0.2s ease;
  color: #374151;
}
.nav-card-prev:hover { background-position: right center; color: white; }
.nav-card-prev:hover .nav-card-label,
.nav-card-prev:hover .nav-card-title { color: white; }

.tutorial-body strong { font-weight: 700; color: #1a1a1a; background: #e0f2fe; padding: 0.05em 0.15em; border-radius: 2px; }
.tutorial-body td strong:not(.kbd),
.tutorial-body .formula-table strong:not(.kbd),
.tutorial-body .td-header strong:not(.kbd),
.tutorial-body .chapter-callout strong:not(.kbd),
.tutorial-body h1 strong:not(.kbd),
.tutorial-body h2 strong:not(.kbd),
.tutorial-body h3 strong:not(.kbd) { background: transparent; padding: 0; color: inherit; }
.tutorial-body .kbd { background: #e0f2fe; padding: 0.05em 0.15em; border-radius: 2px; color: #1a1a1a; }

.tutorial-body a { color: #0369a1; text-decoration: underline; text-underline-offset: 2px; }
.tutorial-body a:hover { color: #0c4a6e; }

.tutorial-body .chapter-callout {
  background: #f0f9ff;
  border-left: 3px solid #0369a1;
  border-radius: 0 8px 8px 0;
  padding: 0.85rem 1.1rem;
  margin-bottom: 1.5rem;
  font-size: 15px;
  line-height: 1.6;
}
.tutorial-body .chapter-callout strong { color: #0c4a6e; }
.tutorial-body .chapter-callout a { color: #0c4a6e; font-weight: 500; }

.tutorial-body table td:first-child { background: #dbeafe; white-space: nowrap; width: 1%; }
.tutorial-body .td-header { background: #dbeafe; font-weight: 700; text-align: center; }

.tutorial-body ol + table,
.tutorial-body ul + table { margin-left: 2.5rem; }

.tutorial-body img { max-width: 100%; height: auto; display: block; margin: 0.75rem auto; }
.tutorial-body ol + p > img,
.tutorial-body ul + p > img { margin-left: 2.25rem; margin-right: auto; max-width: calc(100% - 2.25rem); }
.tutorial-body .img-pair { display: inline-flex; gap: 0.5rem; justify-content: center; width: 100%; margin: 0; }
.tutorial-body .img-pair img { flex: 0 0 auto; max-width: calc(50% - 0.25rem); max-height: none; margin: 0; }

.tutorial-body table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

.tutorial-body pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem 1.25rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.82em;
  line-height: 1.6;
  margin: 0.75rem 0;
}
.tutorial-body pre code { background: none; padding: 0; color: inherit; font-size: inherit; }

@media (max-width: 639px) {
  .tutorial-body { font-size: 15px; line-height: 1.7; }
  .tutorial-body h2 { font-size: 1.1rem; }
  .tutorial-body h3 { font-size: 1.0rem; }
  .tutorial-body .img-pair { flex-wrap: wrap; }
  .tutorial-body .img-pair img { min-width: 130px; }
  .tutorial-body .chapter-callout { font-size: 14px; }
}
`

export default function TutorialLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tutorialStyles }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div className="tutorial-container min-h-screen" style={{ background: '#f4f7fb' }}>
        {children}
      </div>
    </>
  )
}
