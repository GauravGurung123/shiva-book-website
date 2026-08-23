interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  date: string
  thumbnail: string
  slug: string
}

interface Pagination {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export const useBlog = () => {
  const { get } = useApi()
  
  // Fetch paginated blog posts
  const fetchBlogPosts = async (page: number = 1, perPage: number = 10, sortBy: string = 'date', descending: boolean = true) => {
    try {
      // In a real app, this would call your API endpoint
      // For now, we'll use mock data
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Art of Storytelling in Modern Literature',
          excerpt: 'Exploring how contemporary authors are redefining narrative techniques and engaging readers in new ways.',
          content: 'Full content of the blog post...',
          author: 'John Smith',
          category: 'Literature',
          date: '2024-01-15',
          thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
          slug: 'art-of-storytelling'
        },
        {
          id: '2',
          title: 'Best Books for Summer Reading 2024',
          excerpt: 'Our curated list of must-read books to enjoy during the sunny months ahead.',
          content: 'Full content of the blog post...',
          author: 'Sarah Johnson',
          category: 'Recommendations',
          date: '2024-01-10',
          thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
          slug: 'best-books-summer-2024'
        },
        {
          id: '3',
          title: 'Understanding Literary Genres',
          excerpt: 'A comprehensive guide to different literary genres and what makes each unique.',
          content: 'Full content of the blog post...',
          author: 'Emily Davis',
          category: 'Education',
          date: '2024-01-05',
          thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
          slug: 'understanding-literary-genres'
        },
        {
          id: '4',
          title: 'The Rise of Digital Publishing',
          excerpt: 'How technology is transforming the way we write, publish, and consume books.',
          content: 'Full content of the blog post...',
          author: 'Michael Brown',
          category: 'Publishing',
          date: '2024-01-01',
          thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
          slug: 'rise-of-digital-publishing'
        },
        {
          id: '5',
          title: 'Interview with Bestselling Author',
          excerpt: 'An exclusive conversation with one of today\'s most celebrated writers about their craft.',
          content: 'Full content of the blog post...',
          author: 'Lisa Wilson',
          category: 'Interviews',
          date: '2023-12-28',
          thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop',
          slug: 'interview-bestselling-author'
        },
        {
          id: '6',
          title: 'Building Your Home Library',
          excerpt: 'Tips and tricks for creating the perfect reading space in your home.',
          content: 'Full content of the blog post...',
          author: 'David Lee',
          category: 'Lifestyle',
          date: '2023-12-20',
          thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop',
          slug: 'building-home-library'
        },
        {
          id: '7',
          title: 'The Future of Bookstores',
          excerpt: 'Exploring how independent bookstores are adapting and thriving in the digital age.',
          content: 'Full content of the blog post...',
          author: 'Jennifer Martinez',
          category: 'Industry',
          date: '2023-12-15',
          thumbnail: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=300&fit=crop',
          slug: 'future-of-bookstores'
        },
        {
          id: '8',
          title: 'Classic vs Contemporary: A Debate',
          excerpt: 'Comparing the merits of classic literature and modern contemporary works.',
          content: 'Full content of the blog post...',
          author: 'Robert Taylor',
          category: 'Opinion',
          date: '2023-12-10',
          thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop',
          slug: 'classic-vs-contemporary'
        },
        {
          id: '9',
          title: 'Writing Tips from Famous Authors',
          excerpt: 'Timeless advice on the craft of writing from some of history\'s greatest authors.',
          content: 'Full content of the blog post...',
          author: 'Amanda White',
          category: 'Writing',
          date: '2023-12-05',
          thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
          slug: 'writing-tips-famous-authors'
        },
        {
          id: '10',
          title: 'The Impact of Translation',
          excerpt: 'How translated works bridge cultures and bring world literature to new audiences.',
          content: 'Full content of the blog post...',
          author: 'Chris Anderson',
          category: 'Culture',
          date: '2023-12-01',
          thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=300&fit=crop',
          slug: 'impact-of-translation'
        },
        {
          id: '11',
          title: 'Book Club Discussion Guides',
          excerpt: 'Ready-to-use discussion guides for popular book club selections.',
          content: 'Full content of the blog post...',
          author: 'Michelle Clark',
          category: 'Community',
          date: '2023-11-25',
          thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop',
          slug: 'book-club-discussion-guides'
        },
        {
          id: '12',
          title: 'Sustainable Reading Practices',
          excerpt: 'Eco-friendly ways to enjoy books while reducing your environmental footprint.',
          content: 'Full content of the blog post...',
          author: 'Kevin Green',
          category: 'Sustainability',
          date: '2023-11-20',
          thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=300&fit=crop',
          slug: 'sustainable-reading-practices'
        }
      ]
      
      // Sort posts
      let sortedPosts = [...mockPosts]
      if (sortBy === 'date') {
        sortedPosts.sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return descending ? dateB - dateA : dateA - dateB
        })
      } else if (sortBy === 'title') {
        sortedPosts.sort((a, b) => {
          return descending ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
        })
      }
      
      // Paginate
      const total = sortedPosts.length
      const lastPage = Math.ceil(total / perPage)
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedPosts = sortedPosts.slice(startIndex, endIndex)
      
      return {
        posts: paginatedPosts,
        pagination: {
          currentPage: page,
          lastPage,
          perPage,
          total
        }
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      throw err
    }
  }

  return {
    fetchBlogPosts
  }
}
