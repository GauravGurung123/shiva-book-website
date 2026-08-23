import type { BlogPost } from '~/types'

export type { BlogPost }

export interface BlogPagination {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface FetchBlogPostsParams {
  page?: number
  perPage?: number
  sortBy?: string
  descending?: boolean
  sortOrder?: 'asc' | 'desc'
  categoryId?: string | number
  isFeatured?: boolean
}

export const useBlog = () => {
  const { get } = useApi()
  
  // Fetch paginated blog posts
  const fetchBlogPosts = async (
    pageOrParams: number | FetchBlogPostsParams = 1,
    perPageArg: number = 10,
    sortByArg: string = 'created_at',
    descendingArg: boolean = true,
    categoryIdArg?: string | number,
    isFeaturedArg?: boolean
  ) => {
    let page: number
    let perPage: number
    let sortBy: string
    let descending: boolean
    let categoryId: string | number | undefined
    let isFeatured: boolean | undefined

    if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      page = pageOrParams.page ?? 1
      perPage = pageOrParams.perPage ?? 10
      sortBy = pageOrParams.sortBy ?? 'created_at'
      descending = pageOrParams.descending ?? (pageOrParams.sortOrder ? pageOrParams.sortOrder === 'desc' : true)
      categoryId = pageOrParams.categoryId
      isFeatured = pageOrParams.isFeatured
    } else {
      page = pageOrParams
      perPage = perPageArg
      sortBy = sortByArg
      descending = descendingArg
      categoryId = categoryIdArg
      isFeatured = isFeaturedArg
    }

    try {
      // Map sortBy to valid backend fields ('created_at', 'title', 'published_at')
      let apiSortBy = sortBy
      if (sortBy === 'date') {
        apiSortBy = 'published_at'
      }

      const sortOrder = descending ? 'desc' : 'asc'

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        sort_by: apiSortBy,
        sort_order: sortOrder
      })

      if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
        params.append('category_id', categoryId.toString())
      }

      if (isFeatured !== undefined && isFeatured !== null) {
        params.append('is_featured', isFeatured.toString())
      }
      
      const response = await get<any>(`/blog/posts?${params.toString()}`)
      if (response.data && Array.isArray(response.data)) {
        // Map API response to BlogPost interface
        const posts: BlogPost[] = response.data.map((post: any) => ({
          id: post.id?.toString() || post.slug,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.body || post.content,
          body: post.body,
          author: post.creator?.name || post.author || 'Unknown Author',
          category: post.category?.name || post.category || 'Uncategorized',
          category_id: post.category_id,
          date: post.published_at || post.createdAt || post.date,
          thumbnail: post.featured_image_url || post.featured_image || post.thumbnail,
          featured_image: post.featured_image,
          featured_image_url: post.featured_image_url,
          published_at: post.published_at,
          is_featured: post.is_featured,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          meta_keywords: post.meta_keywords,
          views_count: post.views_count,
          reading_time_minutes: post.reading_time_minutes,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          creator: post.creator,
          updater: post.updater
        }))
        
        return {
          posts,
          pagination: {
            currentPage: response.meta?.current_page || page,
            lastPage: response.meta?.last_page || 1,
            perPage: response.meta?.per_page || perPage,
            total: response.meta?.total || posts.length
          }
        }
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      throw err
    }

    return {
      posts: [] as BlogPost[],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage,
        total: 0
      }
    }
  }

  return {
    fetchBlogPosts
  }
}
