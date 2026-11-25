import React from 'react'

export default function ClassCard({ c, mine, wl, left, full, onBook, onCancel, onLeave }) {
  return (
    <article className="class">
      <img src={c.img} alt="" />
      <div className="info"><h3>{c.name}</h3><p>{c.day} {c.time} · {c.coach}</p>
        <span className={'spots' + (left <= 0 ? ' full' : left <= 1 ? ' low' : '')}>{left <= 0 ? 'Full' : left + (left === 1 ? ' spot left' : ' spots left')}</span></div>
      <div className="cta">
        {mine ? <button className="ghost" onClick={onCancel}>Cancel</button>
          : wl ? <button className="ghost" onClick={onLeave}>Leave waitlist</button>
            : <button onClick={onBook}>{full ? 'Join waitlist' : 'Book (1 credit)'}</button>}
        {mine && <small className="ok">Booked</small>}{wl && <small>On waitlist</small>}
      </div>
    </article>
  )
}
