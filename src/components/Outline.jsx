const Outline = ({ headings }) => {
  if (!headings.length) return null
  return (
    <div className="text-sm text-ink space-y-2">
      <p className="uppercase tracking-[0.18em] text-xs text-ink">Outline</p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
            className="leading-6 text-ink"
          >
            <a className="text-accent hover:underline" href={`#${h.id}`}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Outline
