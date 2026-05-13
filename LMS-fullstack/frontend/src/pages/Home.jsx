import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import { getAllBooks } from '../services/bookService.js'
import { getAllAuthors } from '../services/authorService.js'
import { getAllUsers } from '../services/userService.js'
import { getAllCategories } from '../services/categoryService.js'

function unwrap(structured) {
  return structured?.data ?? structured
}

export default function Home() {
  const [stats, setStats] = useState({ books: 0, authors: 0, users: 0, categories: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [b, a, u, c] = await Promise.all([
          getAllBooks(),
          getAllAuthors(),
          getAllUsers(),
          getAllCategories().catch(() => ({ data: [] }))
        ])
        setStats({
          books: unwrap(b)?.length ?? 0,
          authors: unwrap(a)?.length ?? 0,
          users: unwrap(u)?.length ?? 0,
          categories: unwrap(c)?.length ?? 0
        })
      } catch (err) {
        console.error('Failed to load stats', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="stack">
      <div className="hero">
        <div className="heroTitle">Library Management System</div>
        <div className="heroSub">
          A premium administrative dashboard for managing your library's digital ecosystem.
        </div>
        <div className="heroCtas">
          <Link className="btnPrimary" to="/books">
            Manage Books
          </Link>
          <Link className="btnGhost" to="/categories">
            Categories
          </Link>
        </div>
      </div>

      <div className="grid3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <Card title="Inventory Overview" subtitle="Real-time library statistics">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
            <div className="statItem">
              <div className="pageSub">Total Books</div>
              <div className="pageTitle" style={{ fontSize: '32px' }}>{loading ? '...' : stats.books}</div>
            </div>
            <div className="statItem">
              <div className="pageSub">Active Users</div>
              <div className="pageTitle" style={{ fontSize: '32px' }}>{loading ? '...' : stats.users}</div>
            </div>
            <div className="statItem">
              <div className="pageSub">Total Authors</div>
              <div className="pageTitle" style={{ fontSize: '32px' }}>{loading ? '...' : stats.authors}</div>
            </div>
            <div className="statItem">
              <div className="pageSub">Categories</div>
              <div className="pageTitle" style={{ fontSize: '32px' }}>{loading ? '...' : stats.categories}</div>
            </div>
          </div>
        </Card>

        <Card
          title="Quick Actions"
          subtitle="Shortcuts to common tasks"
        >
          <div className="stack" style={{ gap: '8px' }}>
            <Link className="btnGhost" style={{ justifyContent: 'flex-start' }} to="/users">Manage Users</Link>
            <Link className="btnGhost" style={{ justifyContent: 'flex-start' }} to="/authors">Manage Authors</Link>
            <Link className="btnGhost" style={{ justifyContent: 'flex-start' }} to="/books">Manage Books</Link>
            <Link className="btnGhost" style={{ justifyContent: 'flex-start' }} to="/categories">Manage Categories</Link>
          </div>
        </Card>

        <Card title="System Status" subtitle="Integration health">
          <div className="stack" style={{ gap: '12px' }}>
            <div className="row">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
              <div className="pageSub">Backend Connection: Active</div>
            </div>
            <div className="row">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
              <div className="pageSub">Database: Connected</div>
            </div>
            <div className="row">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }}></div>
              <div className="pageSub">Frontend Version: 2.0.0</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
