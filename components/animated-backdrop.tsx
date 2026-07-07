export function AnimatedBackdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="glow one" />
      <span className="glow two" />
      <span className="grid-glow" />
    </div>
  );
}
