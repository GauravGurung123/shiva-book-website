const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/categories': 'Categories',
  '/authors': 'Authors',
  '/publishers': 'Publishers',
  '/books': 'Books',
  '/featured': 'Featured Books',
  '/new-arrivals': 'New Arrivals',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/login': 'Login'
}

export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute()
  
  const setPageTitle = () => {
    const currentPath = route.path
    const pageTitle = routeTitles[currentPath] || 'NepaliBookInEurope'
    
    useHead({
      title: `${pageTitle} — NepaliBookInEurope — Buy Nepali Books Online in Europe | Free Shipping`
    })
  }
  
  // Set initial title
  setPageTitle()
  
  // Watch for route changes
  watch(() => route.path, () => {
    setPageTitle()
  })
})
