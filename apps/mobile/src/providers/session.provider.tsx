import { useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'

import { useStorageState } from '@/hooks/useStorageState'
import { tokenAtom, tokenStore } from '@/providers/token.atom'

const AuthContext = React.createContext<{
  signIn: (token: string) => void
  signOut: () => void
  session?: string | null
  isLoading: boolean
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
})

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />')
    }
  }

  return value
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session')
  const rootSegment = useSegments()[0]
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    tokenStore.set(tokenAtom, session ?? '')

    if (!session && rootSegment !== '(auth)') {
      router.replace('/(auth)/login')
    } else if (session && rootSegment === '(auth)') {
      router.replace('/')
    }
  }, [isLoading, session, router])

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          setSession(token)
        },
        signOut: () => {
          setSession(null)
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
