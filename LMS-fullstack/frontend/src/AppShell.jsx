import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }) => `navLink${isActive ? ' navLinkActive' : ''}`

export default function AppShell() {
  return (
    <div className="appShell">
      <header className="topBar">
        <div className="brand">
          <div className="brandMark">LMS</div>
          <div className="brandText">
            <div className="brandTitle">Library Management</div>
            <div className="brandSub">Spring Boot + React</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink className={linkClass} to="/users">
            Users
          </NavLink>
          <NavLink className={linkClass} to="/authors">
            Authors
          </NavLink>
          <NavLink className={linkClass} to="/books">
            Books
          </NavLink>
          <NavLink className={linkClass} to="/categories">
            Categories
          </NavLink>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

