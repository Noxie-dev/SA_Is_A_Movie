import React, { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'sa_isamovie_consent'
const ConsentContext = createContext(null)

export function ConsentProvider({ children }){
  const [consent, setConsent] = useState(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : { essential: true, analytics: false, ads: false }
    }catch(e){
      return { essential: true, analytics: false, ads: false }
    }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)) }catch(e){}
  }, [consent])

  function update(changes){ setConsent(prev => ({ ...prev, ...changes })) }
  function clear(){ setConsent({ essential: true, analytics: false, ads: false }) }

  return (
    <ConsentContext.Provider value={{ consent, update, clear }}>{children}</ConsentContext.Provider>
  )
}

export function useConsent(){
  const ctx = useContext(ConsentContext)
  if(!ctx) throw new Error('useConsent must be used within ConsentProvider')
  return ctx
}