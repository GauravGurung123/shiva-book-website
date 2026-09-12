import type { Payment, CreatePaymentData, CreatePaymentWithScreenshotData, PaymentMethod } from '~/types'

export const usePayments = () => {
  const { post, postFormData } = useApi()
  const payment = ref<Payment | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Create payment for order (without screenshot)
  const createPayment = async (orderId: number, data: CreatePaymentData): Promise<Payment> => {
    loading.value = true
    error.value = null
    try {
      const response = await post<Payment>(`/payments/orders/${orderId}`, data)
      payment.value = response
      return response
    } catch (err) {
      error.value = 'Failed to create payment'
      console.error('Error creating payment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create payment with screenshot (for manual payment methods like bank_transfer)
  const createPaymentWithScreenshot = async (
    orderId: number,
    data: CreatePaymentWithScreenshotData
  ): Promise<Payment> => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('payment_method', data.payment_method)
      formData.append('payment_reference', data.payment_reference)
      formData.append('screenshot', data.screenshot)

      const response = await postFormData<Payment>(`/payments/orders/${orderId}`, formData)
      payment.value = response
      return response
    } catch (err) {
      error.value = 'Failed to create payment with screenshot'
      console.error('Error creating payment with screenshot:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper to validate payment method
  const isValidPaymentMethod = (method: string): method is PaymentMethod => {
    const validMethods: PaymentMethod[] = [
      'card',
      'paypal',
      'cod',
      'bank_transfer',
      'iban_transfer',
      'multibanco',
      'mb_way'
    ]
    return validMethods.includes(method as PaymentMethod)
  }

  // Get available payment methods
  const getAvailablePaymentMethods = (): PaymentMethod[] => {
    return [
      'card',
      'paypal',
      'cod',
      'bank_transfer',
      'iban_transfer',
      'multibanco',
      'mb_way'
    ]
  }

  // Check if payment method requires screenshot
  const requiresScreenshot = (method: PaymentMethod): boolean => {
    return ['bank_transfer', 'iban_transfer', 'multibanco', 'mb_way'].includes(method)
  }

  return {
    payment,
    loading,
    error,
    createPayment,
    createPaymentWithScreenshot,
    isValidPaymentMethod,
    getAvailablePaymentMethods,
    requiresScreenshot
  }
}
