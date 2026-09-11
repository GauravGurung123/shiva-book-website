import type { SettingResponse } from '~/types'

export const useSettings = () => {
  const { get } = useApi()
  const settings = ref<Record<string, string>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchSetting = async (key: string): Promise<string | null> => {
    try {
      const response = await get<SettingResponse>(`/settings/key/${key}`)
      settings.value[key] = response.value
      return response.value
    } catch (err) {
      console.error(`Error fetching setting ${key}:`, err)
      return null
    }
  }

  const fetchMultipleSettings = async (keys: string[]): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const promises = keys.map(key => fetchSetting(key))
      await Promise.all(promises)
    } catch (err) {
      error.value = 'Failed to fetch settings'
      console.error('Error fetching settings:', err)
    } finally {
      loading.value = false
    }
  }

  const getSetting = (key: string, defaultValue: string = ''): string => {
    return settings.value[key] || defaultValue
  }

  return {
    settings,
    loading,
    error,
    fetchSetting,
    fetchMultipleSettings,
    getSetting
  }
}
