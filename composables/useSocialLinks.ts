import type { SocialLink } from '~/types'

export const useSocialLinks = () => {
  const { get } = useApi()
  const socialLinks = ref<SocialLink[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchActiveSocialLinks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await get<SocialLink[]>('/social-links/active')
      socialLinks.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch social links'
      console.error('Error fetching social links:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    socialLinks,
    loading,
    error,
    fetchActiveSocialLinks
  }
}
