import { useEffect, useMemo, useState } from 'react'
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
    <div className="stack">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="pageHeader">
        <div>
          <div className="pageTitle">Authors</div>
          <div className="pageSub">Manage contributors to your library.</div>
        </div>
      </div>

      <Card title={editingId ? 'Edit author' : 'Create author'} subtitle={editingId ? `Editing ID: ${editingId}` : 'Add a new author to the system'}>
        <form className="formRow" onSubmit={handleSubmit}>
          <label className="field">
            <span>ID</span>
            <input
              disabled={editingId !== null}
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
              inputMode="numeric"
              placeholder="e.g. 1"
            />
          </label>
          <label className="field">
            <span>Name</span>
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
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button className="btnGhost" onClick={() => { setEditingId(null); setForm({ id: '', name: '' }) }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </Card>

      <Card
        title="All authors"
        subtitle="Directory of library authors"
        right={
          <div className="row">
            <input
              className="search"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btnGhost" onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="muted">Loading authors…</div>
        ) : filtered.length === 0 ? (
          <div className="muted">No authors found.</div>
        ) : (
          <div className="table">
            <div className="tr th">
              <div>ID</div>
              <div>Name</div>
              <div className="right">Actions</div>
            </div>
            {filtered.map((a) => (
              <div className="tr" key={a.id}>
                <div className="muted">{a.id}</div>
                <div style={{ fontWeight: '600' }}>{a.name}</div>
                <div className="right row" style={{ gap: '6px' }}>
                  <button className="btnGhost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => onEdit(a)}>
                    Edit
                  </button>
                  <button className="btnDanger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => onDelete(a.id)}>
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
