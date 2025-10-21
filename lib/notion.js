const { Client } = require('@notionhq/client')

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// 获取所有客房数据
async function getRooms() {
  try {
    if (!process.env.NOTION_ROOMS_DB_ID) {
      console.log('NOTION_ROOMS_DB_ID not found')
      return []
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_ROOMS_DB_ID,
    })
    
    return response.results.map(room => {
      const properties = room.properties || {}
      
      return {
        id: room.id,
        name: properties.Name?.title?.[0]?.text?.content || '',
        slug: properties.Slug?.rich_text?.[0]?.text?.content || '',
        subtitle: properties.Subtitle?.rich_text?.[0]?.text?.content || '',
        price: properties.Price?.number || 0,
        capacity: properties.Capacity?.number || 0,
        size: properties.Size?.number || 0,
        amenities: properties.Amenities?.multi_select?.map(item => item.name) || [],
        gallery: properties.Gallery?.files || [],
        description: properties.Description?.rich_text?.[0]?.text?.content || '',
        status: properties.Status?.select?.name || 'Active'
      }
    })
  } catch (error) {
    console.error('Error fetching rooms:', error.message)
    return []
  }
}

// 获取套餐数据
async function getPlans() {
  try {
    if (!process.env.NOTION_PLANS_DB_ID) {
      console.log('NOTION_PLANS_DB_ID not found')
      return []
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_PLANS_DB_ID
    })
    
    return response.results.map(plan => {
      const properties = plan.properties || {}
      
      return {
        id: plan.id,
        name: properties.Name?.title?.[0]?.text?.content || '',
        price: properties.Price?.number || 0,
        duration: properties.Duration?.number || 0,
        description: properties.Description?.rich_text?.[0]?.text?.content || '',
        includes: properties.Includes?.rich_text?.[0]?.text?.content || '',
        popular: properties.Popular?.checkbox || false,
        images: properties.Images?.files || []
      }
    })
  } catch (error) {
    console.error('Error fetching plans:', error.message)
    return []
  }
}

// 获取期刊文章
async function getJournalPosts() {
  try {
    if (!process.env.NOTION_JOURNAL_DB_ID) {
      console.log('NOTION_JOURNAL_DB_ID not found')
      return []
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_JOURNAL_DB_ID,
      sorts: [
        {
          property: 'Publish_Date',
          direction: 'descending'
        }
      ]
    })
    
    return response.results.map(post => {
      const properties = post.properties || {}
      
      return {
        id: post.id,
        title: properties.Title?.title?.[0]?.text?.content || '',
        content: properties.Content?.rich_text?.[0]?.text?.content || '',
        coverImage: properties.Cover_Image?.files?.[0] || null,
        publishDate: properties.Publish_Date?.date?.start || '',
        tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
        featured: properties.Featured?.checkbox || false,
        status: properties.Status?.select?.name || 'Published'
      }
    })
  } catch (error) {
    console.error('Error fetching journal posts:', error.message)
    return []
  }
}

// 获取品牌故事数据
async function getStories() {
  try {
    if (!process.env.NOTION_STORIES_DB_ID) {
      console.log('NOTION_STORIES_DB_ID not found')
      return []
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_STORIES_DB_ID
    })
    
    return response.results.map(story => {
      const properties = story.properties || {}
      
      return {
        id: story.id,
        title: properties.Title?.title?.[0]?.text?.content || '',
        content: properties.Content?.rich_text?.[0]?.text?.content || '',
        quote: properties.Quote?.rich_text?.[0]?.text?.content || '',
        beforeImage: properties.Before_Image?.files?.[0] || null,
        afterImage: properties.After_Image?.files?.[0] || null,
        chapter: properties.Chapter?.select?.name || '',
        status: properties.Status?.select?.name || 'Active'
      }
    })
  } catch (error) {
    console.error('Error fetching stories:', error.message)
    return []
  }
}

// 获取独特体验数据
async function getExperiences() {
  try {
    if (!process.env.NOTION_EXPERIENCES_DB_ID) {
      console.log('NOTION_EXPERIENCES_DB_ID not found')
      return []
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_EXPERIENCES_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
    
    return response.results.map(experience => {
      const properties = experience.properties || {}
      
      return {
        id: experience.id,
        name: properties.Name?.title?.[0]?.text?.content || '',
        icon: properties.Icon?.rich_text?.[0]?.text?.content || '✨',
        description: properties.Description?.rich_text?.[0]?.text?.content || '',
        details: properties.Details?.rich_text?.[0]?.text?.content || '',
        duration: properties.Duration?.number || 0,
        maxGuests: properties.Max_Guests?.number || 0,
        season: properties.Season?.multi_select?.map(item => item.name) || [],
        timeSlots: properties.Time_Slots?.rich_text?.[0]?.text?.content || '',
        coverImage: properties.Cover_Image?.files?.[0] || null,
        category: properties.Category?.select?.name || ''
      }
    })
  } catch (error) {
    console.error('Error fetching experiences:', error.message)
    return []
  }
}

// 获取菜系餐厅数据
async function getCuisines() {
  try {
    if (!process.env.NOTION_CUISINES_DB_ID) {
      console.log('NOTION_CUISINES_DB_ID not found')
      return []
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_CUISINES_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
    
    return response.results.map(cuisine => {
      const properties = cuisine.properties || {}
      
      return {
        id: cuisine.id,
        name: properties.Name?.title?.[0]?.text?.content || '',
        description: properties.Description?.rich_text?.[0]?.text?.content || '',
        coverImage: properties.Cover_Image?.files?.[0] || null,
        style: properties.Style?.select?.name || '',
        operatingHours: properties.Operating_Hours?.rich_text?.[0]?.text?.content || '',
        chef: properties.Chef?.relation?.[0]?.id || null,
        dishes: properties.Dishes?.relation?.map(dish => dish.id) || []
      }
    })
  } catch (error) {
    console.error('Error fetching cuisines:', error.message)
    return []
  }
}

// 获取招牌菜品数据
async function getDishes() {
  try {
    if (!process.env.NOTION_DISHES_DB_ID) {
      console.log('NOTION_DISHES_DB_ID not found')
      return []
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DISHES_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
    
    return response.results.map(dish => {
      const properties = dish.properties || {}
      
      return {
        id: dish.id,
        name: properties.Name?.title?.[0]?.text?.content || '',
        price: properties.Price?.number || 0,
        description: properties.Description?.rich_text?.[0]?.text?.content || '',
        imageGallery: properties.Image_Gallery?.files || [],
        status: properties.Status?.select?.name || '供应中',
        spicyLevel: properties.Spicy_Level?.select?.name || '',
        tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
        cuisine: properties.Cuisine?.relation?.[0]?.id || null
      }
    })
  } catch (error) {
    console.error('Error fetching dishes:', error.message)
    return []
  }
}

// 获取主厨数据
async function getChefs() {
  try {
    if (!process.env.NOTION_CHEFS_DB_ID) {
      console.log('NOTION_CHEFS_DB_ID not found')
      return []
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_CHEFS_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
    
    return response.results.map(chef => {
      const properties = chef.properties || {}
      
      return {
        id: chef.id,
        name: properties.Name?.title?.[0]?.text?.content || '',
        bio: properties.Bio?.rich_text?.[0]?.text?.content || '',
        photo: properties.Photo?.files?.[0] || null,
        specialties: properties.Specialties?.rich_text?.[0]?.text?.content || '',
        experience: properties.Experience?.number || 0
      }
    })
  } catch (error) {
    console.error('Error fetching chefs:', error.message)
    return []
  }
}

// 测试连接函数
async function testNotionConnection() {
  try {
    console.log('🔄 开始测试 Notion 数据库连接...')
    
    const rooms = await getRooms()
    const plans = await getPlans()
    const posts = await getJournalPosts()
    const stories = await getStories()
    const experiences = await getExperiences()
    const cuisines = await getCuisines()
    const dishes = await getDishes()
    const chefs = await getChefs()
    
    console.log('✅ 所有数据库连接成功!')
    
    return {
      success: true,
      data: { 
        rooms, plans, posts, stories, experiences,
        cuisines, dishes, chefs 
      },
      stats: {
        totalRecords: rooms.length + plans.length + posts.length + stories.length + experiences.length + cuisines.length + dishes.length + chefs.length,
        databases: 8,
        coreData: { rooms: rooms.length, plans: plans.length, posts: posts.length },
        brandData: { stories: stories.length, experiences: experiences.length },
        diningData: { cuisines: cuisines.length, dishes: dishes.length, chefs: chefs.length }
      }
    }
  } catch (error) {
    console.error('❌ Notion 连接测试失败:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// 获取特定房间详情
async function getRoomBySlug(slug) {
  try {
    if (!process.env.NOTION_ROOMS_DB_ID || !slug) {
      return null
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_ROOMS_DB_ID,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: slug
        }
      }
    })
    
    if (response.results.length === 0) return null
    
    const room = response.results[0]
    const properties = room.properties || {}
    
    return {
      id: room.id,
      name: properties.Name?.title?.[0]?.text?.content || '',
      slug: properties.Slug?.rich_text?.[0]?.text?.content || '',
      subtitle: properties.Subtitle?.rich_text?.[0]?.text?.content || '',
      description: properties.Description?.rich_text?.[0]?.text?.content || '',
      price: properties.Price?.number || 0,
      capacity: properties.Capacity?.number || 0,
      size: properties.Size?.number || 0,
      amenities: properties.Amenities?.multi_select?.map(item => item.name) || [],
      gallery: properties.Gallery?.files || [],
      featured: properties.Featured?.checkbox || false
    }
  } catch (error) {
    console.error('Error fetching room by slug:', error.message)
    return null
  }
}

module.exports = {
  getRooms,
  getPlans,
  getJournalPosts,
  getStories,
  getExperiences,
  getCuisines,
  getDishes,
  getChefs,
  testNotionConnection,
  getRoomBySlug
}
