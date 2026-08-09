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

export const usePageTitle = () => {
  const route = useRoute()
  
  const getPageTitle = (path?: string): string => {
    const currentPath = path || route.path
    return routeTitles[currentPath] || 'NepaliBookInEurope'
  }
  
  const setTitle = (customTitle?: string) => {
    const pageTitle = customTitle || getPageTitle()
    useHead({
      title: `${pageTitle} — NepaliBookInEurope — Buy Nepali Books Online in Europe | Free Shipping`
    })
  }
  
  return {
    getPageTitle,
    setTitle
  }
}
