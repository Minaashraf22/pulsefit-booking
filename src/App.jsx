import React, { useState } from 'react'
import { classes, days } from './data.js'
import { useBooking } from './hooks/useBooking.js'
import ClassCard from './components/ClassCard.jsx'
import Sidebar from './components/Sidebar.jsx'

export default function App() {
  const b = useBooking()
  const [day, setDay] = useState('All')
  const list = classes.filter(c => day === 'All' || c.day === day)
  return (
    <div className="app">
      <header><div className="brand"><img src="logo.svg" alt="" /><b>PulseFit</b><small>booking demo</small></div></header>
      <div className="layout">
        <main>
          <h1>Class schedule</h1>
          <div className="days">{['All', ...days].map(d => <button key={d} className={d === day ? 'on' : ''} onClick={() => setDay(d)}>{d}</button>)}</div>
          {b.note && <p className="note" role="alert">{b.note}</p>}
          <div className="classes">{list.map(c => (
            <ClassCard key={c.id} c={c} mine={b.st.booked.includes(c.id)} wl={b.st.waitlist.includes(c.id)} left={c.cap - b.taken(c)} full={b.full(c)}
              onBook={() => b.book(c)} onCancel={() => b.cancel(c)} onLeave={() => b.leave(c)} />))}</div>
        </main>
        <Sidebar st={b.st} onBuy={b.buy} onReset={b.reset} />
      </div>
      <footer>PulseFit is a fictional gym for a portfolio demo. Photos are AI-generated. No payments are made.</footer>
    </div>
  )
}
