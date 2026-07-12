export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}