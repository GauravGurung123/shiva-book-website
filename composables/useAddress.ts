export interface Country {
  uuid: string
  common_name: string
  official_name: string
  cca2: string
  cca3: string
  flag_emoji: string
  callingcodes: string[]
}

export interface Address {
  id: number
  label: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  country_uuid: string
  country_data?: {
    uuid: string
    common_name: string
    official_name: string
    cca2: string
    cca3: string
    flag_emoji: string
    callingcodes: string[]
  }
  is_default: boolean
  extra?: any
  createdAt: string
  updatedAt: string
}

export interface AddressFormData {
  label?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country_uuid: string
  is_default?: boolean
  extra?: {
    phone?: string
    nif?: string
    delivery_instructions?: string
  }
}

export const useAddress = () => {
  const { get, post } = useApi()

  // Get countries list
  const getCountries = async (region: string = 'Europe'): Promise<Country[]> => {
    return await get<Country[]>(`/ws/v1/countries?region=${region}`)
  }

  // Get all user addresses
  const getAddresses = async (): Promise<Address[]> => {
    return await get<Address[]>('/ws/v1/addresses')
  }

  // Get specific address
  const getAddress = async (id: number): Promise<Address> => {
    return await get<Address>(`/ws/v1/addresses/${id}`)
  }

  // Create new address
  const createAddress = async (data: AddressFormData): Promise<Address> => {
    return await post<Address>('/ws/v1/addresses', data)
  }

  // Update address
  const updateAddress = async (id: number, data: AddressFormData): Promise<Address> => {
    return await post<Address>(`/ws/v1/addresses/${id}/update`, data)
  }

  // Set address as default
  const setDefaultAddress = async (id: number): Promise<Address> => {
    return await post<Address>(`/ws/v1/addresses/${id}/set-default`, {})
  }

  // Delete address
  const deleteAddress = async (id: number): Promise<void> => {
    await post<void>(`/ws/v1/addresses/${id}/delete`, {})
  }

  return {
    getCountries,
    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress
  }
}
