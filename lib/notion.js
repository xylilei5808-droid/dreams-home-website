const { Client } = require('@notionhq/client')

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// 获取所有客房数据 - 修复字段匹配
async function getRooms() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_ROOMS_DB_ID
      // 移除 Status 过滤，因为可能字段名不同
    })
    
    return response.results.map(room => ({
      id: room.id,
      name: room.properties.Name?.title[0]?.text?.content || '',
      slug: room.properties.Slug?.rich_text[0]?.text?.content || '',
      subtitle: room.properties.Subtitle?.rich_text[0]?.text?.content || '',
      price: room.properties.Price?.number || 0,
      capacity: room.properties.Capacity?.number || 0,
      size: room.properties.Size?.number || 0,
      amenities: room.properties.Amenities?.multi_select?.map(item => item.name) || [],
      gallery: room.properties.Gallery?.files || [],
      description: room.properties.Description?.rich_text[0]?.text?.content || '',
      // 尝试不同的状态字段名
      status: room.properties.Status?.select?.name || room.properties.状态?.select?.name || 'Active'
    }))
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
}

// 获取套餐数据
async function getPlans() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_PLANS_DB_ID
    })
    
    return response.results.map(plan => ({
      id: plan.id,
      name: plan.properties.Name?.title[0]?.text?.content || '',
      price: plan.properties.Price?.number || 0,
      duration: plan.properties.Duration?.number || 0,
      description: plan.properties.Description?.rich_text[0]?.text?.content || '',
      includes: plan.properties.Includes?.rich_text[0]?.text?.content || '',
      popular: plan.properties.Popular?.checkbox || false,
      images: plan.properties.Images?.files || []
    }))
  } catch (error) {
    console.error('Error fetching plans:', error)
    return []
  }
}

// 获取期刊文章 - 修复字段匹配
async function getJournalPosts() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_JOURNAL_DB_ID,
      sorts: [
        {
          property: 'Publish_Date',
          direction: 'descending'
        }
      ]
      // 移除状态过滤，先获取所有数据
    })
    
    return response.results.map(post => ({
      id: post.id,
      title: post.properties.Title?.title[0]?.text?.content || '',
      content: post.properties.Content?.rich_text[0]?.text?.content || '',
      coverImage: post.properties.Cover_Image?.files[0] || null,
      publishDate: post.properties.Publish_Date?.date?.start || '',
      tags: post.properties.Tags?.multi_select?.map(tag => tag.name) || [],
      featured: post.properties.Featured?.checkbox || false,
      // 兼容不同的状态字段名
      status: post.properties.Status?.select?.name || post.properties.状态?.select?.name || 'Published'
    }))
  } catch (error) {
    console.error('Error fetching journal posts:', error)
    return []
  }
}

// 获取品牌故事数据 - 修复字段匹配
async function getStories() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_STORIES_DB_ID
      // 移除状态过滤，直接获取所有数据
    })
    
    return response.results.map(story => ({
      id: story.id,
      title: story.properties.Title?.title[0]?.text?.content || '',
      content: story.properties.Content?.rich_text[0]?.text?.content || '',
      quote: story.properties.Quote?.rich_text[0]?.text?.content || '',
      beforeImage: story.properties.Before_Image?.files[0] || null,
      afterImage: story.properties.After_Image?.files[0] || null,
      chapter: story.properties.Chapter?.select?.name || '',
      // 兼容不同的状态字段名
      status: story.properties.Status?.select?.name || story.properties.状态?.select?.name || 'Active'
    }))
  } catch (error) {
    console.error('Error fetching stories:', error)
    return []
  }
}

// 获取独特体验数据
async function getExperiences() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_EXPERIENCES_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
    
    return response.results.map(experience => ({
      id: experience.id,
      name: experience.properties.Name?.title[0]?.text?.content || '',
      icon: experience.properties.Icon?.rich_text[0]?.text?.content || '✨',
      description: experience.properties.Description?.rich_text[0]?.text?.content || '',
      details: experience.properties.Details?.rich_text[0]?.text?.content || '',
      duration: experience.properties.Duration?.number || 0,
      maxGuests: experience.properties.Max_Guests?.number || 0,
      season: experience.properties.Season?.multi_select?.map(item => item.name) || [],
      timeSlots: experience.properties.Time_Slots?.rich_text[0]?.text?.content || '',
      coverImage: experience.properties.Cover_Image?.files[0] || null,
      category: experience.properties.Category?.select?.name || ''
    }))
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
}

// 获取菜系餐厅数据
async function getCuisines() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_CUISINES_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
    
    return response.results.map(cuisine => ({
      id: cuisine.id,
      name: cuisine.properties.Name?.title[0]?.text?.content || '',
      description: cuisine.properties.Description?.rich_text[0]?.text?.content || '',
      coverImage: cuisine.properties.Cover_Image?.files[0] || null,
      style: cuisine.properties.Style?.select?.name || '',
      operatingHours: cuisine.properties.Operating_Hours?.rich_text[0]?.text?.content || '',
      // 关联字段
      chef: cuisine.properties.Chef?.relation?.[0]?.id || null,
      dishes: cuisine.properties.Dishes?.relation?.map(dish => dish.id) || []
    }))
  } catch (error) {
    console.error('Error fetching cuisines:', error)
    return []
  }
}

// 获取招牌菜品数据
async function getDishes() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DISHES_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
    
    return response.results.map(dish => ({
      id: dish.id,
      name: dish.properties.Name?.title[0]?.text?.content || '',
      price: dish.properties.Price?.number || 0,
      description: dish.properties.Description?.rich_text[0]?.text?.content || '',
      imageGallery: dish.properties.Image_Gallery?.files || [],
      status: dish.properties.Status?.select?.name || '供应中',
      spicyLevel: dish.properties.Spicy_Level?.select?.name || '',
      tags: dish.properties.Tags?.multi_select?.map(tag => tag.name) || [],
      // 关联字段
      cuisine: dish.properties.Cuisine?.relation?.[0]?.id || null
    }))
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return []
  }
}

// 获取主厨数据
async function getChefs() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_CHEFS_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
    
    return response.results.map(chef => ({
      id: chef.id,
      name: chef.properties.Name?.title[0]?.text?.content || '',
      bio: chef.properties.Bio?.rich_text[0]?.text?.content || '',
      photo: chef.properties.Photo?.files[0] || null,
      specialties: chef.properties.Specialties?.rich_text[0]?.text?.content || '',
      experience: chef.properties.Experience?.number || 0
    }))
  } catch (error) {
    console.error('Error fetching chefs:', error)
    return []
  }
}

// 更新测试连接函数
async function testNotionConnection() {
  try {
    console.log('🔄 开始测试 Notion 数据库连接...')
    
    // 测试第一批核心数据库
    console.log('📍 测试核心数据库...')
    const rooms = await getRooms()
    const plans = await getPlans()
    const posts = await getJournalPosts()
    
    // 测试第二批品牌数据库
    console.log('📍 测试品牌数据库...')
    const stories = await getStories()
    const experiences = await getExperiences()
    
    // 测试第三批餐饮数据库
    console.log('📍 测试餐饮数据库...')
    const cuisines = await getCuisines()
    const dishes = await getDishes()
    const chefs = await getChefs()
    
    console.log('✅ 所有数据库连接成功!')
    console.log(`📊 核心数据: 客房${rooms.length}条, 套餐${plans.length}条, 文章${posts.length}条`)
    console.log(`📊 品牌数据: 故事${stories.length}条, 体验${experiences.length}条`)
    console.log(`📊 餐饮数据: 菜系${cuisines.length}条, 菜品${dishes.length}条, 主厨${chefs.length}条`)
    
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
    console.error('❌ Notion 连接测试失败:', error)
    return {
      success: false,
      error: error.message,
      details: error.stack
    }
  }
}

// 获取特定房间详情
async function getRoomBySlug(slug) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_ROOMS_DB_ID,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug
            }
          },
          {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          }
        ]
      }
    })
    
    if (response.results.length === 0) return null
    
    const room = response.results[0]
    return {
      id: room.id,
      name: room.properties.Name?.title[0]?.text?.content || '',
      slug: room.properties.Slug?.rich_text[0]?.text?.content || '',
      subtitle: room.properties.Subtitle?.rich_text[0]?.text?.content || '',
      description: room.properties.Description?.rich_text[0]?.text?.content || '',
      price: room.properties.Price?.number || 0,
      capacity: room.properties.Capacity?.number || 0,
      size: room.properties.Size?.number || 0,
      amenities: room.properties.Amenities?.multi_select?.map(item => item.name) || [],
      gallery: room.properties.Gallery?.files || [],
      featured: room.properties.Featured?.checkbox || false
    }
  } catch (error) {
    console.error('Error fetching room by slug:', error)
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
