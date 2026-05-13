import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  LayoutGrid, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Cpu 
} from 'lucide-react'
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
    <div className="stack" style={{ gap: '32px' }}>
      <div className="hero">
        <div className="heroTitle">Library Management System</div>
        <div className="heroSub">
          A premium administrative dashboard designed for seamless management of your library's digital ecosystem.
        </div>
        <div className="heroCtas">
          <Link className="btnPrimary" to="/books">
            <BookOpen size={20} />
            <span>Manage Books</span>
          </Link>
          <Link className="btnGhost" to="/categories">
            <LayoutGrid size={20} />
            <span>View Categories</span>
          </Link>
        </div>
      </div>

      <div className="grid3">
        <Card 
          title="Inventory Overview" 
          subtitle="Real-time library statistics"
          style={{ animationDelay: '0.1s' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' }}>
            <div className="statItem">
              <div className="row" style={{ gap: '8px', marginBottom: '8px', color: 'var(--primary)' }}>
                <BookOpen size={16} />
                <span className="pageSub" style={{ margin: 0 }}>Books</span>
              </div>
              <div className="pageTitle" style={{ fontSize: '28px' }}>{loading ? '...' : stats.books}</div>
            </div>
            <div className="statItem">
              <div className="row" style={{ gap: '8px', marginBottom: '8px', color: 'var(--secondary)' }}>
                <Users size={16} />
                <span className="pageSub" style={{ margin: 0 }}>Users</span>
              </div>
              <div className="pageTitle" style={{ fontSize: '28px' }}>{loading ? '...' : stats.users}</div>
            </div>
            <div className="statItem">
              <div className="row" style={{ gap: '8px', marginBottom: '8px', color: 'var(--accent)' }}>
                <UserCheck size={16} />
                <span className="pageSub" style={{ margin: 0 }}>Authors</span>
              </div>
              <div className="pageTitle" style={{ fontSize: '28px' }}>{loading ? '...' : stats.authors}</div>
            </div>
            <div className="statItem">
              <div className="row" style={{ gap: '8px', marginBottom: '8px', color: '#fbbf24' }}>
                <LayoutGrid size={16} />
                <span className="pageSub" style={{ margin: 0 }}>Categories</span>
              </div>
              <div className="pageTitle" style={{ fontSize: '28px' }}>{loading ? '...' : stats.categories}</div>
            </div>
          </div>
        </Card>

        <Card
          title="Quick Actions"
          subtitle="Shortcuts to common tasks"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="stack" style={{ gap: '10px' }}>
            <Link className="btnGhost" style={{ justifyContent: 'space-between' }} to="/users">
              <div className="row" style={{ gap: '10px' }}>
                <Users size={18} />
                <span>Manage Users</span>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link className="btnGhost" style={{ justifyContent: 'space-between' }} to="/authors">
              <div className="row" style={{ gap: '10px' }}>
                <UserCheck size={18} />
                <span>Manage Authors</span>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link className="btnGhost" style={{ justifyContent: 'space-between' }} to="/books">
              <div className="row" style={{ gap: '10px' }}>
                <BookOpen size={18} />
                <span>Manage Books</span>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link className="btnGhost" style={{ justifyContent: 'space-between' }} to="/categories">
              <div className="row" style={{ gap: '10px' }}>
                <LayoutGrid size={18} />
                <span>Manage Categories</span>
              </div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </Card>

        <Card 
          title="System Status" 
          subtitle="Integration health"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="stack" style={{ gap: '16px' }}>
            <div className="statItem" style={{ background: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.1)' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: '10px' }}>
                  <Database size={18} style={{ color: '#22c55e' }} />
                  <span className="pageSub" style={{ color: 'var(--text-main)' }}>Backend Connection</span>
                </div>
                <div style={{ padding: '4px 8px', background: '#22c55e20', color: '#22c55e', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>ACTIVE</div>
              </div>
            </div>
            <div className="statItem" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.1)' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: '10px' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
                  <span className="pageSub" style={{ color: 'var(--text-main)' }}>Security Profile</span>
                </div>
                <div style={{ padding: '4px 8px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>SECURE</div>
              </div>
            </div>
            <div className="statItem" style={{ background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.1)' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: '10px' }}>
                  <Cpu size={18} style={{ color: 'var(--secondary)' }} />
                  <span className="pageSub" style={{ color: 'var(--text-main)' }}>System Core</span>
                </div>
                <span className="pageSub" style={{ margin: 0, fontWeight: 700 }}>v2.0.0</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
