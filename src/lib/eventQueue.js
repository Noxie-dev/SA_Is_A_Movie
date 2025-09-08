const QUEUE_BATCH_SIZE = 10
const FLUSH_INTERVAL_MS = 3000
let queue = []
let timer = null

function hasConsent(){
  try{
    const raw = localStorage.getItem('sa_isamovie_consent')
    if(!raw) return false
    const parsed = JSON.parse(raw)
    return !!parsed.analytics
  }catch(e){ return false }
}

function startTimer(){ if(timer) return; timer = setInterval(flush, FLUSH_INTERVAL_MS) }
function stopTimer(){ if(timer){ clearInterval(timer); timer = null } }
export function enqueueEvent(evt){ if(!hasConsent()) return; queue.push(evt); if(queue.length >= QUEUE_BATCH_SIZE) flush(); else startTimer() }
export async function flush(){ if(queue.length === 0) return; const batch = queue.slice(0, QUEUE_BATCH_SIZE); queue = queue.slice(QUEUE_BATCH_SIZE); try{ const payload = JSON.stringify({ events: batch }); const url = '/api/events'; if (navigator && navigator.sendBeacon){ const blob = new Blob([payload], { type: 'application/json' }); navigator.sendBeacon(url, blob) } else { await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload }) } }catch(e){ console.error('Event flush failed', e) } if(queue.length === 0) stopTimer() }