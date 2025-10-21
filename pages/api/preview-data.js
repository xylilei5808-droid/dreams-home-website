import { getRooms, getPlans, getJournalPosts, getStories, getExperiences, getCuisines, getDishes, getChefs } from '../../lib/notion'

export default async function handler(req, res) {
  const { type } = req.query
  
  try {
    let data = []
    let dataType = ''
    
    switch(type) {
      case 'rooms':
        data = await getRooms()
        dataType = '客房数据'
        break
      case 'plans':
        data = await getPlans()
        dataType = '套餐数据'
        break
      case 'journal':
        data = await getJournalPosts()
        dataType = '期刊文章'
        break
      case 'stories':
        data = await getStories()
        dataType = '品牌故事'
        break
      case 'experiences':
        data = await getExperiences()
        dataType = '独特体验'
        break
      case 'cuisines':
        data = await getCuisines()
        dataType = '菜系餐厅'
        break
      case 'dishes':
        data = await getDishes()
        dataType = '招牌菜品'
        break
      case 'chefs':
        data = await getChefs()
        dataType = '主厨团队'
        break
      default:
        return res.status(400).json({ 
          message: '请指定数据类型: rooms, plans, journal, stories, experiences, cuisines, dishes, chefs' 
        })
    }
    
    res.status(200).json({
      message: `${dataType}获取成功`,
      type: dataType,
      count: data.length,
      data: data
    })
    
  } catch (error) {
    res.status(500).json({
      message: '获取数据失败',
      error: error.message
    })
  }
}
