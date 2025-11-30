const Pill = ({ children }) => (
  <span className="px-3 py-1 rounded-md border border-border bg-panel text-sm text-muted hover:border-accent hover:text-accent transition-colors duration-150">
    {children}
  </span>
)

export default Pill
