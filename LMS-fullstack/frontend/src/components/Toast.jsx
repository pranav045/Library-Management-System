import { useEffect } from 'react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => onClose?.(), toast.timeoutMs ?? 2500)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className={`toast toast-${toast.type ?? 'info'}`} role="status">
      <div className="toastTitle">{toast.title}</div>
      {toast.message && <div className="toastMsg">{toast.message}</div>}
      <button className="toastClose" onClick={onClose} aria-label="Close">
        ✕
      </button>
    </div>
  )
}

