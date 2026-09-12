import type { Order, OrdersResponse, CreateOrderData } from '~/types'

export const useOrders = () => {
  const { get, post } = useApi()
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  })

  // Create order from cart
  const createOrder = async (data: CreateOrderData): Promise<Order> => {
    loading.value = true
    error.value = null
    try {
      const response = await post<Order>('/orders', data)
      currentOrder.value = response
      return response
    } catch (err) {
      error.value = 'Failed to create order'
      console.error('Error creating order:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get user orders with pagination
  const fetchOrders = async (page: number = 1, perPage: number = 15): Promise<OrdersResponse> => {
    loading.value = true
    error.value = null
    try {
      const response = await get<OrdersResponse>(`/orders?page=${page}&per_page=${perPage}`)
      orders.value = response.data
      pagination.value = {
        current_page: response.current_page,
        per_page: response.per_page,
        total: response.total,
        last_page: response.last_page
      }
      return response
    } catch (err) {
      error.value = 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get order details
  const fetchOrderDetails = async (orderId: number): Promise<Order> => {
    loading.value = true
    error.value = null
    try {
      const response = await get<Order>(`/orders/${orderId}`)
      currentOrder.value = response
      return response
    } catch (err) {
      error.value = 'Failed to fetch order details'
      console.error('Error fetching order details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    pagination,
    createOrder,
    fetchOrders,
    fetchOrderDetails
  }
}
