import React from 'react'
import { classes, days } from '../data.js'

export default function WeekPanel({ st }) {
  const perDay = days.map(d => ({ d, n: st.booked.filter(id => classes.find(c => c.id === id).day === d).length }))
  const max = Math.max(1, ...perDay.map(x => x.n))
  return (
    <div className="panel"><h3>My week</h3>
      <svg viewBox="0 0 280 110" role="img" aria-label="Bookings per day">{perDay.map((x, i) => (
        <g key={x.d}><rect x={8 + i * 39} y={90 - (x.n / max) * 70} width="26" height={(x.n / max) * 70} rx="4" fill="#f97316" /><text x={21 + i * 39} y="106" textAnchor="middle" fontSize="11" fill="#6b7280">{x.d}</text>
          {x.n > 0 && <text x={21 + i * 39} y={84 - (x.n / max) * 70} textAnchor="middle" fontSize="11" fill="#111827">{x.n}</text>}</g>))}</svg>
      <p className="sum" data-testid="booked">{st.booked.length} booked · {st.waitlist.length} on waitlist</p></div>
  )
}
