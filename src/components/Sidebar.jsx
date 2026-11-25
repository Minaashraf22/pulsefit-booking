import React from 'react'
import WeekPanel from './WeekPanel.jsx'

export default function Sidebar({ st, onBuy, onReset }) {
  return (
    <aside>
      <div className="panel"><small>Class credits</small><div className="credits" data-testid="credits">{st.credits}</div>
        <button onClick={onBuy}>Add 4-class pack</button></div>
      <WeekPanel st={st} />
      <div className="panel"><h3>Activity</h3>{st.history.length === 0 && <p className="muted">Nothing yet.</p>}
        <ul>{st.history.map(h => <li key={h.n}>{h.text}</li>)}</ul>
        <button className="ghost" onClick={onReset}>Reset demo</button></div>
    </aside>
  )
}
