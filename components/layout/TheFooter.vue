<template>
  <footer id="contact" class="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <img 
              src="/logo.png" 
              alt="NepaliBookInEurope Logo" 
              class="h-14 w-auto object-contain"
            />
<!--            <h3 class="text-xl font-bold font-heading text-primary-400">NepaliBookInEurope</h3>-->
          </div>
          <p class="text-gray-400">Europe's premier Nepali bookstore. Bringing the best of Nepali literature to your doorstep.</p>
        </div>
        <div>
          <h4 class="font-semibold mb-4 text-primary-400 font-heading">Quick Links</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-primary-400 transition">About Us</a></li>
            <li><a href="#" class="hover:text-primary-400 transition">Contact</a></li>
            <li><a href="#" class="hover:text-primary-400 transition">FAQs</a></li>
            <li><a href="#" class="hover:text-primary-400 transition">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4 text-primary-400 font-heading">Customer Service</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-primary-400 transition">Shipping Info</a></li>
            <li><a href="#" class="hover:text-primary-400 transition">Returns</a></li>
            <li><a href="#" class="hover:text-primary-400 transition">Order Tracking</a></li>
            <li><a href="#" class="hover:text-primary-400 transition">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4 text-primary-400 font-heading">Contact Us</h4>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-start space-x-2">
              <span class="text-primary-400 mt-1">📧</span>
              <span class="break-words">{{ contactEmail }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-primary-400">📞</span>
              <span>{{ contactPhone }}</span>
            </li>
            <li v-if="contactAddress" class="flex items-center space-x-2">
              <span class="text-primary-400">📍</span>
              <span>{{ contactAddress }}</span>
            </li>
          </ul>
          <h4 class="font-semibold mb-4 mt-6 text-primary-400 font-heading">Follow Us</h4>
          <div class="flex space-x-4">
            <a 
              v-for="link in socialLinks" 
              :key="link.id"
              :href="link.url" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-primary-400 transition text-2xl"
              v-html="link.icon || getPlatformIcon(link.platform)"
            />
          </div>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2026 NepaliBookInEurope. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useSocialLinks } from '~/composables/useSocialLinks'
import { useSettings } from '~/composables/useSettings'

const { socialLinks, fetchActiveSocialLinks } = useSocialLinks()
const { getSetting, fetchMultipleSettings } = useSettings()

const contactEmail = ref('support@NepaliBookInEurope.com')
const contactPhone = ref('+44 20 1234 5678')
const contactAddress = ref('')

const getPlatformIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    tiktok: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    viber: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.398.002C9.473.028 5.331.354 3.015 2.471 1.298 4.182.637 6.763.562 9.966c-.075 3.203-.163 9.2 5.633 10.835h.005l-.004 2.485s-.037.996.621 1.201c.785.246 1.234-.506 1.983-1.319.408-.443.969-1.092 1.396-1.587 3.85.33 6.816-.416 7.155-.527.779-.259 5.179-.815 5.902-6.66.751-6.051-.363-9.868-2.38-11.598-.625-.558-3.287-2.155-9.476-2.194zm.096 1.967c5.352.031 7.865 1.313 8.396 1.777 1.693 1.456 2.588 4.8 1.945 9.925-.595 4.789-4.095 5.24-4.756 5.463-.273.09-2.815.725-6.083.517 0 0-2.438 2.943-3.196 3.704-.121.121-.261.168-.354.151-.131-.024-.167-.174-.165-.382l.02-4.025c-4.849-1.345-4.566-6.35-4.504-9.084.062-2.734.598-4.934 2.058-6.371 1.923-1.754 5.543-2.675 7.639-2.675zm.025 1.817c-.075 0-.135.061-.135.136v4.527c0 .075.06.136.135.136.075 0 .136-.061.136-.136V3.921c0-.075-.061-.136-.136-.136zm3.504 1.621c-.067 0-.131.028-.176.078-.048.053-.068.123-.056.193l.79 4.527c.013.074.079.127.153.127.009 0 .018-.001.027-.003.084-.015.14-.097.125-.181l-.79-4.527a.136.136 0 00-.073-.214zm-7.037.073a.136.136 0 00-.126.085l-.79 4.527c-.015.084.041.166.125.181.009.002.018.003.027.003.074 0 .14-.053.153-.127l.79-4.527c.015-.084-.041-.166-.125-.181a.136.136 0 00-.054.039zm3.533 1.548c-1.627 0-2.926.419-3.636 1.242-.475.551-.734 1.26-.734 2.066 0 1.125.549 2.124 1.522 2.736.966.608 2.345.938 3.848.938 1.504 0 2.883-.33 3.849-.938.973-.612 1.522-1.611 1.522-2.736 0-.806-.259-1.515-.734-2.066-.71-.823-2.009-1.242-3.637-1.242zm0 .819c1.421 0 2.526.357 3.072 1.002.336.39.518.874.518 1.487 0 .821-.397 1.549-1.139 2.016-.795.5-2.015.788-3.451.788-1.435 0-2.655-.288-3.45-.788-.742-.467-1.139-1.195-1.139-2.016 0-.613.182-1.097.518-1.487.546-.645 1.651-1.002 3.071-1.002zm-3.636 4.527c-.075 0-.135.061-.135.136v4.527c0 .075.06.136.135.136.075 0 .136-.061.136-.136v-4.527c0-.075-.061-.136-.136-.136zm7.272 0c-.075 0-.135.061-.135.136v4.527c0 .075.06.136.135.136.075 0 .136-.061.136-.136v-4.527c0-.075-.061-.136-.136-.136z"/></svg>'
  }
  return icons[platform.toLowerCase()] || '🔗'
}

onMounted(async () => {
  await fetchMultipleSettings(['contact_email', 'contact_phone', 'contact_address'])
  contactEmail.value = getSetting('contact_email', 'support@NepaliBookInEurope.com')
  contactPhone.value = getSetting('contact_phone', '+44 20 1234 5678')
  contactAddress.value = getSetting('contact_address', '')
  fetchActiveSocialLinks()
})
</script>
