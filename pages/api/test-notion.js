import { testNotionConnection } from '../../lib/notion'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('🚀 启动 Notion 数据库全面测试...')
    const result = await testNotionConnection()
    
    if (result.success) {
      res.status(200).json({
        message: '🎉 所有 Notion 数据库连接测试成功!',
        success: true,
        stats: result.stats,
        data: {
          // 核心数据摘要
          core: {
            rooms: result.data.rooms.map(r => ({ name: r.name, price: r.price, slug: r.slug })),
            plans: result.data.plans.map(p => ({ name: p.name, price: p.price, duration: p.duration })),
            posts: result.data.posts.map(p => ({ title: p.title, publishDate: p.publishDate }))
          },
          // 品牌数据摘要  
          brand: {
            stories: result.data.stories.map(s => ({ title: s.title, chapter: s.chapter })),
            experiences: result.data.experiences.map(e => ({ 
              name: e.name, 
              icon: e.icon, 
              duration: e.duration,
              season: e.season 
            }))
          }
        },
        timestamp: new Date().toISOString(),
        nextSteps: [
          '✅ 数据库连接正常',
          '📝 可以开始前端组件开发',
          '🎨 建议创建第三批餐饮数据库',
          '🚀 准备部署到 Vercel'
        ]
      })
    } else {
      res.status(500).json({
        message: '❌ Notion 连接测试失败',
        success: false,
        error: result.error,
        details: result.details
      })
    }
  } catch (error) {
    console.error('💥 测试API发生错误:', error)
    res.status(500).json({
      message: '💥 测试过程中发生严重错误',
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}
