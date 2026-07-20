import { useCallback, useState } from 'react'

type AsyncActionState = {
  loading: boolean
  error: string | null
}

export const useAsyncAction = () => {
  const [state, setState] = useState<AsyncActionState>({
    loading: false,
    error: null,
  })

  const run = useCallback(
    async <T>(
      action: () => Promise<T>,
      fallbackError: string
    ): Promise<T | undefined> => {
      setState({ loading: true, error: null })

      try {
        const result = await action()
        setState({ loading: false, error: null })
        return result
      } catch (err) {
        setState({
          loading: false,
          error: err instanceof Error ? err.message : fallbackError,
        })
        return undefined
      }
    },
    []
  )

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const fail = useCallback((message: string) => {
    setState(prev => ({ ...prev, error: message }))
  }, [])

  return { ...state, run, resetError, fail }
}
