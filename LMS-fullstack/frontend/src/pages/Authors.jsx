import { useEffect, useMemo, useState } from 'react'
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  X,
  BookOpen,
  Mail,
  Award
} from 'lucide-react'
import Card from '../components/Card.jsx'
import Toast from '../components/Toast.jsx'
import { createAuthor, deleteAuthor, getAllAuthors } from '../services/authorService.js'

function unwrap(structured) {
  return structured?.data ?? structured
}

export default function Authors() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ id: '', name: '' })
  const [editingId, setEditingId] = useState(null)
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return rows
    return rows.filter(
      (a) =>
        String(a.id).includes(query) ||
        String(a.name ?? '').toLowerCase().includes(query),
    )
  }, [q, rows])

  async function load() {
    setLoading(true)
    try {
      const res = await getAllAuthors()
      const data = unwrap(res)
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Network error'
      setToast({ type: 'error', title: 'Failed to load authors', message: String(msg) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const id = Number(form.id)
    const name = form.name.trim()
    if (!id || !name) {
      setToast({ type: 'warn', title: 'Enter id + name' })
      return
    }

    try {
      await createAuthor({ id, name })
      setForm({ id: '', name: '' })
      setEditingId(null)
      setToast({ type: 'success', title: editingId ? 'Author updated' : 'Author created' })
      await load()
    } catch (err) {
      setToast({ type: 'error', title: 'Save failed', message: err?.message })
    }
  }

  async function onDelete(id) {
    if (!window.confirm(`Delete author ${id}?`)) return
    try {
      await deleteAuthor(id)
      setToast({ type: 'success', title: `Deleted author ${id}` })
      await load()
    } catch (err) {
      setToast({ type: 'error', title: 'Delete failed', message: err?.message })
    }
  }

  function onEdit(author) {
    setEditingId(author.id)
    setForm({ id: String(author.id), name: author.name ?? '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="stack" style={{ gap: '24px' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="pageHeader">
        <div className="row" style={{ gap: '16px' }}>
          <div className="brandMark" style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div className="pageTitle">Authors</div>
            <div className="pageSub">Manage the contributors and creators in your library.</div>
          </div>
        </div>
      </div>

      <Card 
        title={editingId ? 'Edit Author' : 'Add New Author'} 
        subtitle={editingId ? `Updating record for Author ID: ${editingId}` : 'Register a new author in the database'}
        style={{ borderLeft: `4px solid ${editingId ? 'var(--secondary)' : 'var(--primary)'}` }}
      >
        <form className="formRow" onSubmit={handleSubmit}>
          <label className="field">
            <span>Author ID</span>
            <input
              disabled={editingId !== null}
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
              inputMode="numeric"
              placeholder="e.g. 501"
            />
          </label>
          <label className="field">
            <span>Full Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Jules Verne"
            />
          </label>
          <div className="field">
            <span>&nbsp;</span>
            <div className="row">
              <button className="btnPrimary" type="submit">
                {editingId ? <><Edit2 size={16} /> Update</> : <><UserPlus size={16} /> Add Author</>}
              </button>
              {editingId && (
                <button className="btnGhost" type="button" onClick={() => { setEditingId(null); setForm({ id: '', name: '' }) }}>
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </Card>

      <Card
        title="Author Directory"
        subtitle={`${filtered.length} contributors registered`}
        right={
          <div className="row" style={{ gap: '12px' }}>
            <div className="row" style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '2px 12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                className="search"
                placeholder="Search authors..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ width: '180px', border: 'none', background: 'transparent' }}
              />
            </div>
            <button className="btnGhost" onClick={load} disabled={loading} style={{ padding: '8px 12px' }}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="muted row" style={{ justifyContent: 'center', padding: '40px' }}>
            <RefreshCw size={24} className="animate-spin" style={{ marginRight: '12px' }} />
            <span>Fetching contributors…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '40px' }}>
            <UserCheck size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
            <div>No authors found matching your criteria.</div>
          </div>
        ) : (
          <div className="table">
            <div className="tr th" style={{ gridTemplateColumns: '100px 1.5fr 1fr 1fr auto' }}>
              <div>ID</div>
              <div>Name</div>
              <div>Total Works</div>
              <div>Recognition</div>
              <div className="right">Actions</div>
            </div>
            {filtered.map((a) => (
              <div className="tr" key={a.id} style={{ gridTemplateColumns: '100px 1.5fr 1fr 1fr auto' }}>
                <div className="muted" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>#{a.id}</div>
                <div className="row" style={{ gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-card-hover)', display: 'grid', placeItems: 'center', color: 'var(--secondary)' }}>
                    <UserPlus size={16} />
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{a.name}</div>
                </div>
                <div className="row" style={{ gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <BookOpen size={14} />
                  Multiple Works
                </div>
                <div className="row" style={{ gap: '6px' }}>
                   <div className="row" style={{ 
                     padding: '4px 10px', 
                     borderRadius: '8px', 
                     fontSize: '11px',
                     fontWeight: 700,
                     background: 'rgba(168, 85, 247, 0.1)',
                     color: 'var(--secondary)',
                     border: '1px solid rgba(168, 85, 247, 0.2)',
                     width: 'fit-content',
                     gap: '6px',
                     textTransform: 'uppercase'
                   }}>
                     <Award size={14} />
                     Verified
                   </div>
                </div>
                <div className="right row" style={{ gap: '8px' }}>
                  <button className="btnGhost" style={{ padding: '6px' }} onClick={() => onEdit(a)} title="Edit Author">
                    <Edit2 size={14} />
                  </button>
                  <button className="btnDanger" style={{ padding: '6px' }} onClick={() => onDelete(a.id)} title="Remove Author">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
