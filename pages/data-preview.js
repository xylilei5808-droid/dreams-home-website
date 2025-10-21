import { useState, useEffect } from 'react'

export default function DataPreview() {
  const [roomsData, setRoomsData] = useState(null)
  const [plansData, setPlansData] = useState(null)
  const [journalData, setJournalData] = useState(null)
  const [experiencesData, setExperiencesData] = useState(null)
  // 新增餐饮数据状态
  const [cuisinesData, setCuisinesData] = useState(null)
  const [dishesData, setDishesData] = useState(null)
  const [chefsData, setChefsData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async (type, setter) => {
    try {
      const response = await fetch(`/api/preview-data?type=${type}`)
      const data = await response.json()
      setter(data)
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
    }
  }

  const loadAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchData('rooms', setRoomsData),
      fetchData('plans', setPlansData),
      fetchData('journal', setJournalData),
      fetchData('experiences', setExperiencesData),
      // 新增餐饮数据获取
      fetchData('cuisines', setCuisinesData),
      fetchData('dishes', setDishesData),
      fetchData('chefs', setChefsData)
    ])
    setLoading(false)
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const DataSection = ({ title, data, renderItem }) => (
    <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #007acc', paddingBottom: '0.5rem' }}>
        {title} {data && `(${data.count || 0} 条)`}
      </h2>
      {data ? (
        data.count > 0 ? (
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {data.data.map((item, index) => renderItem(item, index))}
          </div>
        ) : (
          <p style={{ color: '#666', fontStyle: 'italic' }}>暂无数据</p>
        )
      ) : (
        <p>加载中...</p>
      )}
    </div>
  )

  const RoomCard = (room, index) => (
    <div key={index} style={{ 
      border: '1px solid #ddd', 
      borderRadius: '6px', 
      padding: '1rem',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#007acc' }}>{room.name}</h3>
      <p style={{ margin: '0.25rem 0', color: '#666' }}>{room.subtitle}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <span><strong>价格:</strong> ¥{room.price}/晚</span>
        <span><strong>人数:</strong> {room.capacity}人</span>
        <span><strong>面积:</strong> {room.size}㎡</span>
      </div>
      {room.amenities && room.amenities.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <strong>设施:</strong>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            {room.amenities.map((amenity, i) => (
              <span key={i} style={{ 
                backgroundColor: '#e7f3ff', 
                color: '#0066cc', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const PlanCard = (plan, index) => (
    <div key={index} style={{ 
      border: '1px solid #ddd', 
      borderRadius: '6px', 
      padding: '1rem',
      backgroundColor: '#f0f8f0'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#00aa00' }}>{plan.name}</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
        <span><strong>价格:</strong> ¥{plan.price}</span>
        <span><strong>天数:</strong> {plan.duration}天</span>
        {plan.popular && <span style={{ color: '#ff6600', fontWeight: 'bold' }}>🔥 热门</span>}
      </div>
      <p style={{ margin: '0', color: '#555' }}>{plan.description}</p>
      {plan.includes && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
          <strong>包含:</strong> {plan.includes}
        </div>
      )}
    </div>
  )

  const JournalCard = (post, index) => (
    <div key={index} style={{ 
      border: '1px solid #ddd', 
      borderRadius: '6px', 
      padding: '1rem',
      backgroundColor: '#fff8f0'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#cc6600' }}>{post.title}</h3>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
        发布日期: {post.publishDate}
        {post.featured && <span style={{ marginLeft: '0.5rem', color: '#ff6600' }}>⭐ 精选</span>}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {post.tags.map((tag, i) => (
            <span key={i} style={{ 
              backgroundColor: '#ffe7cc', 
              color: '#cc6600', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )

  const ExperienceCard = (experience, index) => (
    <div key={index} style={{ 
      border: '1px solid #ddd', 
      borderRadius: '6px', 
      padding: '1rem',
      backgroundColor: '#f8f0ff'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#8800cc' }}>
        {experience.icon} {experience.name}
      </h3>
      <p style={{ margin: '0.25rem 0', color: '#666' }}>{experience.description}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {experience.duration > 0 && <span><strong>时长:</strong> {experience.duration}分钟</span>}
        {experience.maxGuests > 0 && <span><strong>人数:</strong> 最多{experience.maxGuests}人</span>}
      </div>
    </div>
  )

  // 新增餐饮数据展示组件
  const CuisineCard = (cuisine, index) => (
    <div key={index} style={{ 
      border: '1px solid #ddd', 
      borderRadius: '6px', 
      padding: '1rem',
      backgroundColor: '#fff5f5'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#cc0000' }}>{cuisine.name}</h3>
      <p style={{ margin: '0.25rem 0', color: '#666' }}>{cuisine.description}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {cuisine.style && <span><strong>菜系:</strong> {cuisine.style}</span>}
        {cuisine.operatingHours && <span><strong>营业时间:</strong> {cuisine.operatingHours}</span>}
      </div>
    </div>
  )

  const DishCard = (dish, index) => (
    <div key={index} style={{ 
      border: '1px solid #ddd', 
      borderRadius: '6px', 
      padding: '1rem',
      backgroundColor: '#f5fff5'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#00aa00' }}>{dish.name}</h3>
      <p style={{ margin: '0.25rem 0', color: '#666' }}>{dish.description}</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
        <span><strong>价格:</strong> ¥{dish.price}</span>
        <span><strong>状态:</strong> {dish.status}</span>
        {dish.spicyLevel && <span><strong>辣度:</strong> {dish.spicyLevel}</span>}
      </div>
      {dish.tags && dish.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {dish.tags.map((tag, i) => (
            <span key={i} style={{ 
              backgroundColor: '#e7ffe7', 
              color: '#00aa00', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )

  const ChefCard = (chef, index) => (
    <div key={index} style={{ 
      border: '1px solid #ddd', 
      borderRadius: '6px', 
      padding: '1rem',
      backgroundColor: '#f0f0ff'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#0000cc' }}>{chef.name}</h3>
      <p style={{ margin: '0.25rem 0', color: '#666' }}>{chef.bio}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {chef.specialties && <span><strong>专长:</strong> {chef.specialties}</span>}
        {chef.experience > 0 && <span><strong>经验:</strong> {chef.experience}年</span>}
      </div>
    </div>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333', 
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          🏠 梦想之家 - 完整数据展示预览
        </h1>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            onClick={loadAllData}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 刷新中...' : '🔄 刷新数据'}
          </button>
        </div>

        <DataSection 
          title="🏠 客房展示" 
          data={roomsData} 
          renderItem={RoomCard}
        />

        <DataSection 
          title="📦 套餐计划" 
          data={plansData} 
          renderItem={PlanCard}
        />

        <DataSection 
          title="📰 期刊文章" 
          data={journalData} 
          renderItem={JournalCard}
        />

        <DataSection 
          title="✨ 独特体验" 
          data={experiencesData} 
          renderItem={ExperienceCard}
        />

        {/* 新增餐饮数据展示 */}
        <DataSection 
          title="🍽️ 菜系餐厅" 
          data={cuisinesData} 
          renderItem={CuisineCard}
        />

        <DataSection 
          title="🥘 招牌菜品" 
          data={dishesData} 
          renderItem={DishCard}
        />

        <DataSection 
          title="👨‍🍳 主厨团队" 
          data={chefsData} 
          renderItem={ChefCard}
        />

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>🎯 开发进度</h3>
          <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            <li>✅ Notion 数据库连接 - 完成</li>
            <li>✅ 核心数据获取 - 完成 (客房/套餐/文章)</li>
            <li>✅ 品牌数据获取 - 完成 (故事/体验)</li>
            <li>✅ 餐饮数据获取 - 完成 (菜系/菜品/主厨)</li>
            <li>🔄 网站前端UI设计</li>
            <li>🔄 响应式布局开发</li>
            <li>🔄 SEO优化和部署</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
