import { Link } from 'react-router-dom'
import navItems from '../config/navItems'

export const Sidebar = ({ currentPath }) => (
  <aside className="hidden md:flex flex-col gap-2 w-32 pt-4">
    {navItems.map((item) => {
      const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)
      return (
        <Link key={item.key} to={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
          {item.label}
        </Link>
      )
    })}
  </aside>
)

export const MobileNav = ({ currentPath }) => (
  <div className="md:hidden flex flex-wrap items-center gap-2 mb-4">
    {navItems.map((item) => {
      const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)
      return (
        <Link
          key={item.key}
          to={item.path}
          className={`px-3 py-1 rounded-md border text-sm ${
            isActive ? 'bg-ink text-white border-ink' : 'border-border bg-white text-muted'
          }`}
        >
          {item.label}
        </Link>
      )
    })}
  </div>
)

export default Sidebar
