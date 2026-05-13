import { useEffect, useMemo, useState } from 'react'
import { 
  LayoutGrid, 
  Plus, 
  Search, 
  RefreshCw, 
  Trash2, 
  Tag,
  Hash,
  Filter
} from 'lucide-react'
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
        'Network error'
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
      setToast({ type: 'warn', title: 'Enter category name' })
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
    if (!window.confirm(`Permanently delete category "${name}"?`)) return
    try {
      await deleteCategory(name)
      setToast({ type: 'success', title: `Deleted category ${name}` })
      await load()
    } catch (err) {
      setToast({ type: 'error', title: 'Delete failed', message: err?.message })
    }
  }

  return (
    <div className="stack" style={{ gap: '24px' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="pageHeader">
        <div className="row" style={{ gap: '16px' }}>
          <div className="brandMark" style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
            <LayoutGrid size={24} />
          </div>
          <div>
            <div className="pageTitle">Categories</div>
            <div className="pageSub">Organize your library collection into logical genres and topics.</div>
          </div>
        </div>
      </div>

      <Card 
        title="Add New Category" 
        subtitle="Define a new organizational tag for your books"
        style={{ borderLeft: '4px solid var(--primary)' }}
      >
        <form className="formRow" onSubmit={onCreate}>
          <label className="field" style={{ gridColumn: 'span 3' }}>
            <span>Category Name</span>
            <div className="row" style={{ position: 'relative' }}>
              <Tag size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Science Fiction, Biography, Technical..."
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </label>
          <div className="field">
            <span>&nbsp;</span>
            <button className="btnPrimary" type="submit">
              <Plus size={16} />
              Create
            </button>
          </div>
        </form>
      </Card>

      <Card
        title="Available Categories"
        subtitle={`${filtered.length} unique labels found`}
        right={
          <div className="row" style={{ gap: '12px' }}>
            <div className="row" style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '2px 12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                className="search"
                placeholder="Search categories..."
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
            <span>Syncing categories…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '40px' }}>
            <Filter size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
            <div>No categories matching your search.</div>
          </div>
        ) : (
          <div className="table">
            <div className="tr th" style={{ gridTemplateColumns: '80px 1fr auto' }}>
              <div>Index</div>
              <div>Category Name</div>
              <div className="right">Actions</div>
            </div>
            {filtered.map((c, idx) => (
              <div className="tr" key={c.name} style={{ gridTemplateColumns: '80px 1fr auto' }}>
                <div className="muted" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>#{idx + 1}</div>
                <div className="row" style={{ gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-card-hover)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                    <Hash size={16} />
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{c.name}</div>
                </div>
                <div className="right">
                  <button className="btnDanger" style={{ padding: '6px 12px' }} onClick={() => onDelete(c.name)}>
                    <Trash2 size={14} style={{ marginRight: '6px' }} />
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
