import { useEffect, useMemo, useState } from 'react'
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  BookOpen,
  Filter,
  X
} from 'lucide-react'
import Card from '../components/Card.jsx'
import Toast from '../components/Toast.jsx'
import { createBook, deleteBook, getAllBooks } from '../services/bookService.js'
import { getAllAuthors } from '../services/authorService.js'
import { getAllCategories } from '../services/categoryService.js'

function unwrap(structured) {
  return structured?.data ?? structured
}

export default function Books() {
  const [rows, setRows] = useState([])
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ id: '', name: '', status: '', authorId: '', categoryName: '' })
  const [editingId, setEditingId] = useState(null)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return rows
    return rows.filter((b) => {
      const hay = `${b.id} ${b.name ?? ''} ${b.status ?? ''} ${b.author?.name ?? ''}`.toLowerCase()
      return hay.includes(query)
    })
  }, [q, rows])

  async function loadData() {
    setLoading(true)
    try {
      const [resB, resA, resC] = await Promise.all([
        getAllBooks(),
        getAllAuthors(),
        getAllCategories().catch(() => ({ data: [] }))
      ])
      
      setRows(Array.isArray(unwrap(resB)) ? unwrap(resB) : [])
      setAuthors(Array.isArray(unwrap(resA)) ? unwrap(resA) : [])
      setCategories(Array.isArray(unwrap(resC)) ? unwrap(resC) : [])
    } catch (e) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Network error'
      setToast({ type: 'error', title: 'Failed to load data', message: String(msg) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const id = Number(form.id)
    const name = form.name.trim()
    if (!id || !name) {
      setToast({ type: 'warn', title: 'Enter id + name' })
      return
    }

    const payload = {
      id,
      name,
      status: form.status.trim() || 'Available',
      author: form.authorId ? { id: Number(form.authorId) } : null,
      categories: form.categoryName ? [{ name: form.categoryName }] : []
    }

    try {
      await createBook(payload)
      setForm({ id: '', name: '', status: '', authorId: '', categoryName: '' })
      setEditingId(null)
      setToast({ type: 'success', title: editingId ? 'Book updated' : 'Book created' })
      await loadData()
    } catch (err) {
      setToast({ type: 'error', title: 'Save failed', message: err?.message })
    }
  }

  async function onDelete(id) {
    if (!window.confirm(`Delete book ${id}?`)) return
    try {
      await deleteBook(id)
      setToast({ type: 'success', title: `Deleted book ${id}` })
      await loadData()
    } catch (err) {
      setToast({ type: 'error', title: 'Delete failed', message: err?.message })
    }
  }

  function onEdit(book) {
    setEditingId(book.id)
    setForm({
      id: String(book.id),
      name: book.name ?? '',
      status: book.status ?? '',
      authorId: book.author?.id ? String(book.author.id) : '',
      categoryName: book.categories?.[0]?.name ?? ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="stack" style={{ gap: '24px' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="pageHeader">
        <div className="row" style={{ gap: '16px' }}>
          <div className="brandMark" style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="pageTitle">Books</div>
            <div className="pageSub">Manage your library inventory and stock.</div>
          </div>
        </div>
      </div>

      <Card 
        title={editingId ? 'Edit Book Details' : 'Add New Book'} 
        subtitle={editingId ? `Modifying record for Book ID: ${editingId}` : 'Register a new book in the system'}
        style={{ borderLeft: `4px solid ${editingId ? 'var(--secondary)' : 'var(--primary)'}` }}
      >
        <form className="stack" onSubmit={handleSubmit}>
          <div className="formRow">
            <label className="field">
              <span>Book ID</span>
              <input
                disabled={editingId !== null}
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                inputMode="numeric"
                placeholder="Unique numeric ID"
              />
            </label>
            <label className="field">
              <span>Title</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. The Great Gatsby"
              />
            </label>
            <label className="field">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="search"
                style={{ width: '100%', background: 'rgba(2, 6, 23, 0.55)', color: '#e2e8f0' }}
              >
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Archived">Archived</option>
              </select>
            </label>
          </div>
          
          <div className="formRow" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
            <label className="field">
              <span>Author</span>
              <select
                value={form.authorId}
                onChange={(e) => setForm((f) => ({ ...f, authorId: e.target.value }))}
                className="search"
                style={{ width: '100%', background: 'rgba(2, 6, 23, 0.55)', color: '#e2e8f0' }}
              >
                <option value="">No Author Assigned</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Category</span>
              <select
                value={form.categoryName}
                onChange={(e) => setForm((f) => ({ ...f, categoryName: e.target.value }))}
                className="search"
                style={{ width: '100%', background: 'rgba(2, 6, 23, 0.55)', color: '#e2e8f0' }}
              >
                <option value="">No Category Assigned</option>
                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <div className="field">
              <span>&nbsp;</span>
              <div className="row">
                <button className="btnPrimary" type="submit">
                  {editingId ? <><Edit2 size={16} /> Update</> : <><Plus size={16} /> Create Book</>}
                </button>
                {editingId && (
                  <button className="btnGhost" type="button" onClick={() => { setEditingId(null); setForm({ id: '', name: '', status: '', authorId: '', categoryName: '' }) }}>
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Card>

      <Card
        title="Inventory List"
        subtitle={`${filtered.length} books found`}
        right={
          <div className="row" style={{ gap: '12px' }}>
            <div className="row" style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '2px 12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                className="search"
                placeholder="Search inventory..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ width: '200px', border: 'none', background: 'transparent' }}
              />
            </div>
            <button className="btnGhost" onClick={loadData} disabled={loading} style={{ padding: '8px 12px' }}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="muted row" style={{ justifyContent: 'center', padding: '40px' }}>
            <RefreshCw size={24} className="animate-spin" style={{ marginRight: '12px' }} />
            <span>Syncing inventory…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '40px' }}>
            <Filter size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
            <div>No matching books in the collection.</div>
          </div>
        ) : (
          <div className="table">
            <div className="tr th" style={{ gridTemplateColumns: '80px 1.5fr 1fr 1fr 1fr auto' }}>
              <div>ID</div>
              <div>Title</div>
              <div>Author</div>
              <div>Category</div>
              <div>Status</div>
              <div className="right">Actions</div>
            </div>
            {filtered.map((b) => (
              <div className="tr" key={b.id} style={{ gridTemplateColumns: '80px 1.5fr 1fr 1fr 1fr auto' }}>
                <div className="muted" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>#{b.id}</div>
                <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{b.name}</div>
                <div className="muted">{b.author?.name ?? '—'}</div>
                <div>{b.categories?.map(c => c.name).join(', ') || 'Uncategorized'}</div>
                <div>
                   <div className="row" style={{ 
                     padding: '4px 10px', 
                     borderRadius: '8px', 
                     fontSize: '12px',
                     fontWeight: 600,
                     background: b.status?.toLowerCase() === 'available' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                     color: b.status?.toLowerCase() === 'available' ? '#4ade80' : '#fb7185',
                     border: `1px solid ${b.status?.toLowerCase() === 'available' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                     width: 'fit-content',
                     gap: '6px'
                   }}>
                     {b.status?.toLowerCase() === 'available' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                     {b.status || 'Available'}
                   </div>
                </div>
                <div className="right row" style={{ gap: '8px' }}>
                  <button className="btnGhost" style={{ padding: '6px' }} onClick={() => onEdit(b)} title="Edit Book">
                    <Edit2 size={14} />
                  </button>
                  <button className="btnDanger" style={{ padding: '6px' }} onClick={() => onDelete(b.id)} title="Delete Book">
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
