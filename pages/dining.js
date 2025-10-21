import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Dining() {
  const [cuisines, setCuisines] = useState([])
  const [dishes, setDishes] = useState([])
  const [chefs, setChefs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiningData = async () => {
      try {
        const [cuisinesRes, dishesRes, chefsRes] = await Promise.all([
          fetch('/api/preview-data?type=cuisines'),
          fetch('/api/preview-data?type=dishes'),
          fetch('/api/preview-data?type=chefs')
        ])
        
        const cuisinesData = await cuisinesRes.json()
        const dishesData = await dishesRes.json()
        const chefsData = await chefsRes.json()
        
        setCuisines(cuisinesData.data || [])
        setDishes(dishesData.data || [])
        setChefs(chefsData.data || [])
      } catch (error) {
        console.error('Error fetching dining data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiningData()
  }, [])

  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#fafafa'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2c5530'
    },
    backLink: {
      color: '#666',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '20px',
      fontSize: '0.9rem'
    },
    hero: {
      background: 'linear-gradient(135deg, rgba(204, 102, 0, 0.8), rgba(255, 140, 0, 0.6))',
      color: 'white',
      padding: '4rem 2rem',
      textAlign: 'center'
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: '300',
      marginBottom: '1rem'
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      opacity: '0.9'
    },
    section: {
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      textAlign: 'center',
      marginBottom: '1rem',
      color: '#2c5530',
      fontWeight: '300'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '3rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease'
    },
    cardHeader: {
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #ff8c00, #cc6600)',
      color: 'white'
    },
    cardTitle: {
      fontSize: '1.4rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    cardContent: {
      padding: '1.5rem'
    },
    dishGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginTop: '3rem'
    },
    dishCard: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 3px 15px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f0f0f0'
    },
    price: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#cc6600',
      marginTop: '1rem'
    },
    tags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    tag: {
      backgroundColor: '#fff3e0',
      color: '#cc6600',
      padding: '0.3rem 0.8rem',
      borderRadius: '15px',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    chefGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      marginTop: '3rem'
    },
    chefCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
    },
    chefAvatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      margin: '0 auto 1rem'
    }
  }

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🍽️</div>
          <p>加载餐饮信息中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>🍽️ 餐饮体验</div>
          <Link href="/" style={styles.backLink}>← 返回首页</Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>食事体验</h1>
        <p style={styles.heroSubtitle}>匠心独运的料理艺术，源自大自然的馈赠</p>
      </section>

      {/* 菜系展示 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>特色菜系</h2>
        <div style={styles.grid}>
          {cuisines.length > 0 ? cuisines.map((cuisine, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{cuisine.name}</h3>
                <p style={{opacity: 0.9, margin: 0}}>{cuisine.style}</p>
              </div>
              <div style={styles.cardContent}>
                <p>{cuisine.description}</p>
                {cuisine.operatingHours && (
                  <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#666'}}>
                    <strong>营业时间:</strong> {cuisine.operatingHours}
                  </p>
                )}
              </div>
            </div>
          )) : (
            <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '2rem'}}>
              <p style={{fontSize: '1.1rem', color: '#666'}}>
                🚧 菜系信息正在完善中，敬请期待...
              </p>
              <p style={{fontSize: '0.9rem', color: '#999', marginTop: '1rem'}}>
                建议在 Notion 中添加菜系数据来展示这里的内容
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 招牌菜品 */}
      <section style={{...styles.section, backgroundColor: 'white'}}>
        <h2 style={styles.sectionTitle}>招牌菜品</h2>
        <div style={styles.dishGrid}>
          {dishes.length > 0 ? dishes.map((dish, index) => (
            <div key={index} style={styles.dishCard}>
              <h3 style={{...styles.cardTitle, color: '#2c5530'}}>{dish.name}</h3>
              <p style={{color: '#666', marginBottom: '1rem'}}>{dish.description}</p>
              <div style={styles.price}>¥{dish.price}</div>
              <div style={{fontSize: '0.9rem', color: '#888', marginTop: '0.5rem'}}>
                状态: {dish.status}
                {dish.spicyLevel && ` · ${dish.spicyLevel}`}
              </div>
              {dish.tags && dish.tags.length > 0 && (
                <div style={styles.tags}>
                  {dish.tags.map((tag, i) => (
                    <span key={i} style={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )) : (
            <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '2rem'}}>
              <p style={{fontSize: '1.1rem', color: '#666'}}>
                🍽️ 菜品信息正在完善中...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 主厨团队 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>主厨团队</h2>
        <div style={styles.chefGrid}>
          {chefs.length > 0 ? chefs.map((chef, index) => (
            <div key={index} style={styles.chefCard}>
              <div style={styles.chefAvatar}>👨‍🍳</div>
              <h3 style={styles.cardTitle}>{chef.name}</h3>
              <p style={{color: '#666', marginBottom: '1rem'}}>{chef.bio}</p>
              {chef.specialties && (
                <p style={{fontSize: '0.9rem', color: '#cc6600', fontWeight: '500'}}>
                  擅长: {chef.specialties}
                </p>
              )}
              {chef.experience > 0 && (
                <p style={{fontSize: '0.9rem', color: '#888'}}>
                  从业经验: {chef.experience}年
                </p>
              )}
            </div>
          )) : (
            <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '2rem'}}>
              <p style={{fontSize: '1.1rem', color: '#666'}}>
                👨‍🍳 主厨信息正在完善中...
              </p>
            </div>
          )}
        </div>
      </section>

      <footer style={{backgroundColor: '#2c5530', color: 'white', padding: '2rem', textAlign: 'center'}}>
        <p>© 2024 梦想之家温泉民宿 - 餐饮体验</p>
      </footer>
    </div>
  )
}
