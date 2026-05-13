export default function Card({ title, subtitle, right, children, style }) {
  return (
    <div className="card" style={style}>
      {(title || subtitle || right) && (
        <div className="cardHeader">
          <div>
            {title && <div className="cardTitle">{title}</div>}
            {subtitle && <div className="cardSub">{subtitle}</div>}
          </div>
          {right && <div className="cardRight">{right}</div>}
        </div>
      )}
      <div className="cardBody">{children}</div>
    </div>
  )
}

