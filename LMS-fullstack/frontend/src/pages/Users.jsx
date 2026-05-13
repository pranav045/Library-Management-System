import { useEffect, useMemo, useState } from 'react'
import { 
  Users as UsersIcon, 
  UserPlus, 
  Search, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  X,
  User,
  Shield,
  Clock
} from 'lucide-react'
import Card from '../components/Card.jsx'
import Toast from '../components/Toast.jsx'
import { createUser, deleteUser, getAllUsers } from '../services/userService.js'

function unwrap(structured) {
  return structured?.data ?? structured
}

export default function Users() {
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
      (u) =>
        String(u.id).includes(query) ||
        String(u.name ?? '').toLowerCase().includes(query),
    )
  }, [q, rows])

  async function load() {
    setLoading(true)
    try {
      const res = await getAllUsers()
      const data = unwrap(res)
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Network error'
      setToast({ type: 'error', title: 'Failed to load users', message: String(msg) })
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
      await createUser({ id, name })
      setForm({ id: '', name: '' })
      setEditingId(null)
      setToast({ type: 'success', title: editingId ? 'User updated' : 'User created' })
      await load()
    } catch (err) {
      setToast({ type: 'error', title: 'Save failed', message: err?.message })
    }
  }

  async function onDelete(id) {
    if (!window.confirm(`Delete user ${id}?`)) return
    try {
      await deleteUser(id)
      setToast({ type: 'success', title: `Deleted user ${id}` })
      await load()
    } catch (err) {
      setToast({ type: 'error', title: 'Delete failed', message: err?.message })
    }
  }

  function onEdit(user) {
    setEditingId(user.id)
    setForm({ id: String(user.id), name: user.name ?? '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="stack" style={{ gap: '24px' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="pageHeader">
        <div className="row" style={{ gap: '16px' }}>
          <div className="brandMark" style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
            <UsersIcon size={24} />
          </div>
          <div>
            <div className="pageTitle">Users</div>
            <div className="pageSub">Manage library members and their access credentials.</div>
          </div>
        </div>
      </div>

      <Card 
        title={editingId ? 'Edit User' : 'Register New User'} 
        subtitle={editingId ? `Updating profile for member #${editingId}` : 'Create a new account for a library member'}
        style={{ borderLeft: `4px solid ${editingId ? 'var(--secondary)' : 'var(--primary)'}` }}
      >
        <form className="formRow" onSubmit={handleSubmit}>
          <label className="field">
            <span>Member ID</span>
            <input
              disabled={editingId !== null}
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
              inputMode="numeric"
              placeholder="e.g. 1001"
            />
          </label>
          <label className="field">
            <span>Full Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Jane Doe"
            />
          </label>
          <div className="field">
            <span>&nbsp;</span>
            <div className="row">
              <button className="btnPrimary" type="submit">
                {editingId ? <><Edit2 size={16} /> Update</> : <><UserPlus size={16} /> Register</>}
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
        title="User Directory"
        subtitle={`${filtered.length} active members`}
        right={
          <div className="row" style={{ gap: '12px' }}>
            <div className="row" style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '2px 12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                className="search"
                placeholder="Search members..."
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
            <span>Fetching members…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '40px' }}>
            <User size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
            <div>No members found in the directory.</div>
          </div>
        ) : (
          <div className="table">
            <div className="tr th" style={{ gridTemplateColumns: '100px 1fr 140px 140px auto' }}>
              <div>ID</div>
              <div>Name</div>
              <div>Role</div>
              <div>Status</div>
              <div className="right">Actions</div>
            </div>
            {filtered.map((u) => (
              <div className="tr" key={u.id} style={{ gridTemplateColumns: '100px 1fr 140px 140px auto' }}>
                <div className="muted" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>#{u.id}</div>
                <div className="row" style={{ gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-card-hover)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                    <User size={16} />
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{u.name}</div>
                </div>
                <div className="row" style={{ gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <Shield size={14} />
                  Member
                </div>
                <div>
                   <div className="row" style={{ 
                     padding: '4px 10px', 
                     borderRadius: '8px', 
                     fontSize: '12px',
                     fontWeight: 600,
                     background: 'rgba(34, 197, 94, 0.1)',
                     color: '#4ade80',
                     border: '1px solid rgba(34, 197, 94, 0.2)',
                     width: 'fit-content',
                     gap: '6px'
                   }}>
                     <Clock size={14} />
                     Active
                   </div>
                </div>
                <div className="right row" style={{ gap: '8px' }}>
                  <button className="btnGhost" style={{ padding: '6px' }} onClick={() => onEdit(u)} title="Edit Member">
                    <Edit2 size={14} />
                  </button>
                  <button className="btnDanger" style={{ padding: '6px' }} onClick={() => onDelete(u.id)} title="Remove Member">
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
