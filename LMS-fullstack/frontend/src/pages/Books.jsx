import { useEffect, useMemo, useState } from 'react'
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
      status: form.status.trim() || null,
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
    <div className="stack">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="pageHeader">
        <div>
          <div className="pageTitle">Books</div>
          <div className="pageSub">Manage your library inventory.</div>
        </div>
      </div>

      <Card title={editingId ? 'Edit book' : 'Create book'} subtitle={editingId ? `Editing ID: ${editingId}` : 'Add a new book to the system'}>
        <form className="stack" onSubmit={handleSubmit}>
          <div className="formRow">
            <label className="field">
              <span>ID</span>
              <input
                disabled={editingId !== null}
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                inputMode="numeric"
                placeholder="e.g. 101"
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
              <input
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                placeholder="e.g. Available"
              />
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
                <option value="">No Author</option>
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
                <option value="">No Category</option>
                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <div className="field">
              <span>&nbsp;</span>
              <div className="row">
                <button className="btnPrimary" type="submit">
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button className="btnGhost" onClick={() => { setEditingId(null); setForm({ id: '', name: '', status: '', authorId: '', categoryName: '' }) }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Card>

      <Card
        title="Inventory"
        subtitle="Active book listings"
        right={
          <div className="row">
            <input
              className="search"
              placeholder="Search by title, ID, or author…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: '240px' }}
            />
            <button className="btnGhost" onClick={loadData} disabled={loading}>
              Refresh
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="muted">Loading inventory…</div>
        ) : filtered.length === 0 ? (
          <div className="muted">No books found in the library.</div>
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
                <div className="muted">{b.id}</div>
                <div style={{ fontWeight: '600' }}>{b.name}</div>
                <div>{b.author?.name ?? '-'}</div>
                <div>{b.categories?.map(c => c.name).join(', ') || '-'}</div>
                <div>
                   <span style={{ 
                     padding: '2px 8px', 
                     borderRadius: '6px', 
                     fontSize: '11px',
                     background: b.status?.toLowerCase() === 'available' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                     color: b.status?.toLowerCase() === 'available' ? '#4ade80' : '#f87171',
                     border: `1px solid ${b.status?.toLowerCase() === 'available' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`
                   }}>
                     {b.status || 'Unknown'}
                   </span>
                </div>
                <div className="right row" style={{ gap: '6px' }}>
                  <button className="btnGhost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => onEdit(b)}>
                    Edit
                  </button>
                  <button className="btnDanger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => onDelete(b.id)}>
                    Delete
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
