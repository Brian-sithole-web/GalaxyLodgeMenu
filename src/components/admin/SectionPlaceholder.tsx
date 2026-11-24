type SectionPlaceholderProps = {
  sectionName: string;
  summary: string;
};

/**
 * Presentational component in src/components/admin.
 * Holds a sidebar destination that is visible but not built yet.
 */
export function SectionPlaceholder({ sectionName, summary }: SectionPlaceholderProps) {
  return (
    <section className="admin-panel">
      <h2>{sectionName}</h2>
      <p>{summary}</p>
    </section>
  );
}
