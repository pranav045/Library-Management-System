import { NavLink, Outlet, Link } from 'react-router-dom'
import { Users, BookOpen, UserCheck, LayoutGrid, Library } from 'lucide-react'

const linkClass = ({ isActive }) => `navLink${isActive ? ' navLinkActive' : ''}`

export default function AppShell() {
  return (
    <div className="appShell">
      <header className="topBar">
        <Link to="/" className="brand">
          <div className="brandMark">
            <Library size={24} />
          </div>
          <div className="brandText">
            <div className="brandTitle">LMS</div>
            <div className="brandSub">Admin Dashboard</div>
          </div>
        </Link>

        <nav className="nav">
          <NavLink className={linkClass} to="/users">
            <div className="row" style={{ gap: '6px' }}>
              <Users size={18} />
              <span>Users</span>
            </div>
          </NavLink>
          <NavLink className={linkClass} to="/authors">
            <div className="row" style={{ gap: '6px' }}>
              <UserCheck size={18} />
              <span>Authors</span>
            </div>
          </NavLink>
          <NavLink className={linkClass} to="/books">
            <div className="row" style={{ gap: '6px' }}>
              <BookOpen size={18} />
              <span>Books</span>
            </div>
          </NavLink>
          <NavLink className={linkClass} to="/categories">
            <div className="row" style={{ gap: '6px' }}>
              <LayoutGrid size={18} />
              <span>Categories</span>
            </div>
          </NavLink>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

