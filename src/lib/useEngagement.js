import { useEffect } from 'react'
import { enqueueEvent, flush } from './eventQueue'
import { useConsent } from '../context/ConsentContext'

export default function useEngagement(pageId, ctx = {}){
  const { consent } = useConsent()
  useEffect(()=>{
    const startedAt = Date.now()
    const sessionId = ctx.sessionId || (Math.random().toString(36).slice(2))
    function send(type, payload = {}){ if(!consent.analytics) return; enqueueEvent({ sessionId, pageId, type, payload, ts: new Date().toISOString() }) }
    send('page_load', { viewport: { w: window.innerWidth, h: window.innerHeight }, referrer: document.referrer })
    let lastScrollPct = 0
    let scrollTimer = null
    function onScroll(){ if(scrollTimer) return; scrollTimer = setTimeout(()=>{ const pct = Math.round(((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100); if(pct !== lastScrollPct){ lastScrollPct = pct; send('scroll', { pct }) } scrollTimer = null }, 200) }
    document.addEventListener('scroll', onScroll, { passive: true })
    let visibilityStart = Date.now()
    function onVisibilityChange(){ if(document.visibilityState === 'visible'){ visibilityStart = Date.now(); send('visible', {}) } else { send('hidden', { durationMs: Date.now() - visibilityStart }) } }
    document.addEventListener('visibilitychange', onVisibilityChange)
    const observed = new Map()
    const io = new IntersectionObserver((entries)=>{ entries.forEach(entry =>{ const id = entry.target.getAttribute('data-section-id') || entry.target.id || null; if(!id) return; if(entry.isIntersecting){ observed.set(id, Date.now()); send('section_enter', { id }) } else { const enterAt = observed.get(id); if(enterAt){ const duration = Date.now() - enterAt; observed.delete(id); send('section_exit', { id, duration }) } } }) }, { threshold: [0.25, 0.5, 0.75] })
    document.querySelectorAll('[data-section-id]').forEach(el => io.observe(el))
    function onBeforeUnload(){ send('session_end', { durationMs: Date.now() - startedAt }); flush() }
    window.addEventListener('pagehide', onBeforeUnload)
    window.addEventListener('beforeunload', onBeforeUnload)
    return ()=>{ document.removeEventListener('scroll', onScroll); document.removeEventListener('visibilitychange', onVisibilityChange); window.removeEventListener('pagehide', onBeforeUnload); window.removeEventListener('beforeunload', onBeforeUnload); io.disconnect() }
  }, [pageId, consent.analytics]) }