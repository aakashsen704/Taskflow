export default function Spinner({ size = 28 }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="animate-spin rounded-full border-2 border-line border-t-accent"
      style={{ width: size, height: size }}
    />
  );
}
