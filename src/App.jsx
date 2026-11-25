import React, { useEffect, useState } from 'react'
import { classes, days, START_CREDITS } from './data.js'

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

export default function App() {
  const [st, setSt] = useState(() => load('pf-state', { credits: START_CREDITS, booked: [], waitlist: [], history: [] }))
  const [day, setDay] = useState('All')
  const [note, setNote] = useState('')
  useEffect(() => localStorage.setItem('pf-state', JSON.stringify(st)), [st])

  const taken = c => c.taken + (st.booked.includes(c.id) ? 1 : 0)
  const full = c => taken(c) >= c.cap
  const clash = c => classes.find(o => o.id !== c.id && st.booked.includes(o.id) && o.day === c.day && o.time === c.time)
  const log = (s, text) => ({ ...s, history: [{ text, n: s.history.length + 1 }, ...s.history].slice(0, 20) })

  function book(c) {
    if (st.booked.includes(c.id)) return
    if (full(c)) { setNote(''); setSt(s => s.waitlist.includes(c.id) ? s : log({ ...s, waitlist: [...s.waitlist, c.id] }, `Joined waitlist: ${c.name} ${c.day} ${c.time}`)); return }
    if (st.credits < 1) { setNote('No credits left. Buy a class pack to book more classes.'); return }
    if (clash(c)) { setNote('You already have a class at that time.'); return }
    setNote('')
    setSt(s => log({ ...s, credits: s.credits - 1, booked: [...s.booked, c.id], waitlist: s.waitlist.filter(x => x !== c.id) }, `Booked: ${c.name} ${c.day} ${c.time}`))
  }
  function cancel(c) { setSt(s => log({ ...s, credits: s.credits + 1, booked: s.booked.filter(x => x !== c.id) }, `Cancelled: ${c.name} ${c.day} ${c.time} (credit returned)`)); setNote('') }
  const leave = c => setSt(s => ({ ...s, waitlist: s.waitlist.filter(x => x !== c.id) }))
  const buy = () => { setSt(s => log({ ...s, credits: s.credits + 4 }, 'Added a 4-class pack (demo, no payment)')); setNote('') }
  const reset = () => { setSt({ credits: START_CREDITS, booked: [], waitlist: [], history: [] }); setNote('') }

  const list = classes.filter(c => day === 'All' || c.day === day)
  const perDay = days.map(d => ({ d, n: st.booked.filter(id => classes.find(c => c.id === id).day === d).length }))
  const max = Math.max(1, ...perDay.map(x => x.n))

  return (
    <div className="app">
      <header><div className="brand"><img src="logo.svg" alt="" /><b>PulseFit</b><small>booking demo</small></div></header>
      <div className="layout">
        <main>
          <h1>Class schedule</h1>
          <div className="days">{['All', ...days].map(d => <button key={d} className={d === day ? 'on' : ''} onClick={() => setDay(d)}>{d}</button>)}</div>
          {note && <p className="note" role="alert">{note}</p>}
          <div className="classes">{list.map(c => {
            const mine = st.booked.includes(c.id), wl = st.waitlist.includes(c.id), left = c.cap - taken(c)
            return (
              <article key={c.id} className="class">
                <img src={c.img} alt="" />
                <div className="info"><h3>{c.name}</h3><p>{c.day} {c.time} · {c.coach}</p>
                  <span className={'spots' + (left <= 0 ? ' full' : left <= 1 ? ' low' : '')}>{left <= 0 ? 'Full' : left + (left === 1 ? ' spot left' : ' spots left')}</span></div>
                <div className="cta">
                  {mine ? <button className="ghost" onClick={() => cancel(c)}>Cancel</button>
                    : wl ? <button className="ghost" onClick={() => leave(c)}>Leave waitlist</button>
                      : <button onClick={() => book(c)}>{full(c) ? 'Join waitlist' : 'Book (1 credit)'}</button>}
                  {mine && <small className="ok">Booked</small>}{wl && <small>On waitlist</small>}
                </div>
              </article>)
          })}</div>
        </main>
        <aside>
          <div className="panel"><small>Class credits</small><div className="credits" data-testid="credits">{st.credits}</div>
            <button onClick={buy}>Add 4-class pack</button></div>
          <div className="panel"><h3>My week</h3>
            <svg viewBox="0 0 280 110" role="img" aria-label="Bookings per day">{perDay.map((x, i) => (
              <g key={x.d}><rect x={8 + i * 39} y={90 - (x.n / max) * 70} width="26" height={(x.n / max) * 70} rx="4" fill="#f97316" /><text x={21 + i * 39} y="106" textAnchor="middle" fontSize="11" fill="#6b7280">{x.d}</text>
                {x.n > 0 && <text x={21 + i * 39} y={84 - (x.n / max) * 70} textAnchor="middle" fontSize="11" fill="#111827">{x.n}</text>}</g>))}</svg>
            <p className="sum" data-testid="booked">{st.booked.length} booked · {st.waitlist.length} on waitlist</p></div>
          <div className="panel"><h3>Activity</h3>{st.history.length === 0 && <p className="muted">Nothing yet.</p>}
            <ul>{st.history.map(h => <li key={h.n}>{h.text}</li>)}</ul>
            <button className="ghost" onClick={reset}>Reset demo</button></div>
        </aside>
      </div>
      <footer>PulseFit is a fictional gym for a portfolio demo. Photos are AI-generated. No payments are made.</footer>
    </div>
  )
}
