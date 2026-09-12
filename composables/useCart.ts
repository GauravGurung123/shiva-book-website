import type { Cart, CartItem, AddToCartData, UpdateQuantityData, CartResponse } from '~/types'

export const useCart = () => {
  const { get, post, put, delete: del } = useApi()
  const cart = useState<Cart | null>('cart', () => null)
  const loading = useState<boolean>('cartLoading', () => false)
  const error = useState<string | null>('cartError', () => null)
  const sessionId = useCookie('session_id')

  // Initialize session ID if not exists
  const initSession = () => {
    if (!sessionId.value) {
      sessionId.value = crypto.randomUUID()
    }
  }

  // Get cart
  const fetchCart = async (): Promise<Cart> => {
    initSession()
    loading.value = true
    error.value = null
    try {
      const response = await get<CartResponse>('/cart')
      cart.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch cart'
      console.error('Error fetching cart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add item to cart
  const addToCart = async (data: AddToCartData): Promise<Cart> => {
    initSession()
    loading.value = true
    error.value = null
    try {
      const response = await post<CartResponse>('/cart/items', data)
      cart.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to add item to cart'
      console.error('Error adding to cart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId: number): Promise<Cart> => {
    initSession()
    loading.value = true
    error.value = null
    try {
      const response = await del<CartResponse>(`/cart/items/${itemId}`)
      cart.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to remove item from cart'
      console.error('Error removing from cart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update item quantity
  const updateQuantity = async (itemId: number, data: UpdateQuantityData): Promise<Cart> => {
    initSession()
    loading.value = true
    error.value = null
    try {
      const response = await put<CartResponse>(`/cart/items/${itemId}/quantity`, data)
      cart.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to update item quantity'
      console.error('Error updating quantity:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear cart
  const clearCart = async (): Promise<void> => {
    initSession()
    loading.value = true
    error.value = null
    try {
      await del<void>('/cart')
      cart.value = null
    } catch (err) {
      error.value = 'Failed to clear cart'
      console.error('Error clearing cart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get cart item count
  const itemCount = computed(() => cart.value?.total_quantity || 0)

  // Get cart total
  const cartTotal = computed(() => cart.value?.total || 0)

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    cartTotal
  }
}
