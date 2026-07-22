export default function AdminResourcesLoading() {
  return <div className="resource-admin-page" aria-busy="true" aria-label="Loading Resource Studio"><div className="resource-admin-skeleton is-hero" /><div className="resource-admin-metrics">{Array.from({ length: 4 }, (_, index) => <div className="resource-admin-skeleton is-metric" key={index} />)}</div><div className="resource-admin-skeleton is-list" /></div>;
}
