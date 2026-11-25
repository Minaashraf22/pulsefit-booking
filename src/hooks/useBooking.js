import { useEffect, useState } from 'react'
import { classes, START_CREDITS } from '../data.js'

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const fresh = () => ({ credits: START_CREDITS, booked: [], waitlist: [], history: [] })
const log = (s, text) => ({ ...s, history: [{ text, n: s.history.length + 1 }, ...s.history].slice(0, 20) })

export function useBooking() {
  const [st, setSt] = useState(() => load('pf-state', fresh()))
  const [note, setNote] = useState('')
  useEffect(() => localStorage.setItem('pf-state', JSON.stringify(st)), [st])

  const taken = c => c.taken + (st.booked.includes(c.id) ? 1 : 0)
  const full = c => taken(c) >= c.cap
  const clash = c => classes.find(o => o.id !== c.id && st.booked.includes(o.id) && o.day === c.day && o.time === c.time)

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
  const reset = () => { setSt(fresh()); setNote('') }
  return { st, note, taken, full, book, cancel, leave, buy, reset }
}
