export default function AdminPracticeLoading() {
  return (
    <div className="practice-admin-page practice-admin-loading" aria-busy="true" aria-label="Loading Practice Journey">
      <div className="practice-admin-skeleton practice-admin-skeleton-hero" />
      <div className="practice-admin-metrics">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="practice-admin-skeleton practice-admin-skeleton-metric" key={index} />
        ))}
      </div>
      <div className="practice-admin-layout">
        <div className="practice-admin-skeleton practice-admin-skeleton-content" />
        <div className="practice-admin-skeleton practice-admin-skeleton-aside" />
      </div>
    </div>
  );
}
