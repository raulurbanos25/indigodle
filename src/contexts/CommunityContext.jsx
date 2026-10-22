import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CommunityContext = createContext(null)
const SESSION_KEY = 'indigodle:community-session'
let memorySession = null

function getSessionId() {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
      window.sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    memorySession ??= `${Date.now()}-${Math.random().toString(36).slice(2)}`
    return memorySession
  }
}

async function post(endpoint, sessionId) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })
  if (!response.ok) throw new Error('Community API unavailable')
  return response.json()
}

function estadoDesde(data) {
  return { visits: data.visits, likes: data.likes, liked: Boolean(data.liked), ready: true, error: false }
}

export function CommunityProvider({ children }) {
  const sessionId = useMemo(getSessionId, [])
  const [state, setState] = useState({ visits: null, likes: null, liked: false, ready: false, error: false, liking: false })

  useEffect(() => {
    let activo = true
    post('/api/community/visit', sessionId)
      .then((data) => { if (activo) setState((actual) => ({ ...actual, ...estadoDesde(data) })) })
      .catch(() => { if (activo) setState((actual) => ({ ...actual, ready: true, error: true })) })
    return () => { activo = false }
  }, [sessionId])

  async function darMeGusta() {
    if (state.liked || state.liking || state.error) return
    setState((actual) => ({ ...actual, liking: true }))
    try {
      const data = await post('/api/community/like', sessionId)
      setState((actual) => ({ ...actual, ...estadoDesde(data), liking: false }))
    } catch {
      setState((actual) => ({ ...actual, liking: false, error: true }))
    }
  }

  return (
    <CommunityContext.Provider value={{ ...state, darMeGusta }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (!context) throw new Error('useCommunity debe usarse dentro de CommunityProvider')
  return context
}
