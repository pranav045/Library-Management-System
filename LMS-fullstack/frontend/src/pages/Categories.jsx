import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card.jsx'
import Toast from '../components/Toast.jsx'
import { createCategory, deleteCategory, getAllCategories } from '../services/categoryService.js'

function unwrap(structured) {
  return structured?.data ?? structured
}

export default function Categories() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '' })
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return rows
    return rows.filter(
      (c) =>
        String(c.name ?? '').toLowerCase().includes(query),
    )
  }, [q, rows])

  async function load() {
    setLoading(true)
    try {
      const res = await getAllCategories()
      const data = unwrap(res)
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      const msg =
        e?.response?.data?.message ??
        e?.response?.data?.data ??
        e?.message ??
        'Network error — is the backend running on port 8080?'
      setToast({ type: 'error', title: 'Failed to load categories', message: String(msg) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      setToast({ type: 'warn', title: 'Enter name' })
      return
    }

    try {
      await createCategory({ name })
      setForm({ name: '' })
      setToast({ type: 'success', title: 'Category created' })
      await load()
    } catch (err) {
      setToast({ type: 'error', title: 'Create failed', message: err?.message })
    }
  }

  async function onDelete(name) {
    try {
      await deleteCategory(name)
      setToast({ type: 'success', title: `Deleted category ${name}` })
      await load()
    } catch (err) {
      setToast({ type: 'error', title: 'Delete failed', message: err?.message })
    }
  }

  return (
    <div className="stack">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="pageHeader">
        <div>
          <div className="pageTitle">Categories</div>
          <div className="pageSub">Create, search, and delete book categories.</div>
        </div>
      </div>

      <Card title="Create category" subtitle="Backend: POST /saveCategory">
        <form className="formRow" onSubmit={onCreate}>
          <label className="field" style={{ gridColumn: 'span 3' }}>
            <span>Category Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Science Fiction"
            />
          </label>
          <div className="field">
            <span>&nbsp;</span>
            <button className="btnPrimary" type="submit">
              Create
            </button>
          </div>
        </form>
      </Card>

      <Card
        title="All categories"
        subtitle="Backend: GET /getAllCategories"
        right={
          <div className="row">
            <input
              className="search"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="muted">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="muted">No categories found.</div>
        ) : (
          <div className="table">
            <div className="tr th">
              <div style={{ gridColumn: 'span 3' }}>Name</div>
              <div className="right">Actions</div>
            </div>
            {filtered.map((c) => (
              <div className="tr" key={c.name}>
                <div style={{ gridColumn: 'span 3' }}>{c.name}</div>
                <div className="right">
                  <button className="btnDanger" onClick={() => onDelete(c.name)}>
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
