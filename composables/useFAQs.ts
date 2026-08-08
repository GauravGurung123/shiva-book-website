import type { FAQ } from '~/types'

export const useFAQs = () => {
  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How long does delivery take?',
      answer: 'We deliver within 1-2 business days across Europe.'
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer 15-day returns on all orders. Books must be in original condition.'
    },
    {
      id: 3,
      question: 'Do you ship internationally?',
      answer: 'Currently we ship across all European countries.'
    },
    {
      id: 4,
      question: 'How can I track my order?',
      answer: 'You\'ll receive a tracking number via email once your order is dispatched.'
    }
  ]

  return {
    faqs
  }
}
