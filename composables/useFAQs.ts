import type { FAQ } from '~/types'

export const useFAQs = () => {
  const { get } = useApi()
  const faqs = ref<FAQ[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchFAQs = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await get<{ data: FAQ[] }>('/faqs/all')
      faqs.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch FAQs'
      console.error('Failed to fetch FAQs:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    faqs,
    loading,
    error,
    fetchFAQs
  }
}
