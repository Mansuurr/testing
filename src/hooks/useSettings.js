import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings')
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}