import React, { useState } from 'react'
import { useConsent } from '../context/ConsentContext'

export default function ConsentBanner(){
  const { consent, update } = useConsent()
  const [open, setOpen] = useState(!(consent.analytics || consent.ads))

  function acceptAll(){ update({ analytics: true, ads: true }); setOpen(false) }
  function rejectAll(){ update({ analytics: false, ads: false }); setOpen(false) }
  function savePreferences(e){ e.preventDefault(); const form = new FormData(e.target); update({ analytics: form.get('analytics') === 'on', ads: form.get('ads') === 'on' }); setOpen(false) }

  if(!open) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-lg bg-gray-900 text-white p-4 rounded shadow-lg">
      <h3 className="font-bold mb-2">We use cookies</h3>
      <p className="text-sm text-gray-300 mb-3">SA_isaMovie uses cookies to personalise content, measure engagement, and serve ads. Choose your preferences.</p>
      <form onSubmit={savePreferences} className="mb-3">
        <label className="flex items-center gap-2 mb-2"><input defaultChecked={consent.analytics} name="analytics" type="checkbox"/> Analytics (usage & performance)</label>
        <label className="flex items-center gap-2 mb-2"><input defaultChecked={consent.ads} name="ads" type="checkbox"/> Advertising (personalised ads)</label>
        <div className="flex gap-2 mt-3">
          <button type="button" onClick={rejectAll} className="px-3 py-2 bg-gray-700 rounded">Reject all</button>
          <button type="submit" className="px-3 py-2 bg-saisaYellow text-black rounded">Save preferences</button>
          <button type="button" onClick={acceptAll} className="px-3 py-2 bg-saisaPink rounded text-white">Accept all</button>
        </div>
      </form>
      <p className="text-xs text-gray-500">You can change these settings later in Privacy.</p>
    </div>
  )
}