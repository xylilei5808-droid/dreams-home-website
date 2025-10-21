import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [rooms, setRooms] = useState([])
  const [plans, setPlans] = useState([])
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, plansRes, experiencesRes] = await Promise.all([
          fetch('/api/preview-data?type=rooms'),
          fetch('/api/preview-data?type=plans'),
          fetch('/api/preview-data?type=experiences')
        ])
        
        const roomsData = await roomsRes.json()
        const plansData = await plansRes.json()
        const experiencesData = await experiencesRes.json()
        
        setRooms(roomsData.data || [])
        setPlans(plansData.data || [])
        setExperiences(experiencesData.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 获取 Notion 图片 URL 的辅助函数
  const getImageUrl = (imageArray) => {
    if (!imageArray || imageArray.length === 0) return null
    const image = imageArray[0]
    
    // 处理不同类型的图片
    if (image.type === 'file') {
      return image.file?.url || null
    } else if (image.type === 'external') {
      return image.external?.url || null
    }
    return null
  }

  // 内联图片组件，避免外部依赖
  const NotionImage = ({ images, alt, fallbackIcon = '🏠', style = {}, overlayText = null }) => {
    const imageUrl = getImageUrl(images)
    
    const baseStyle = {
      width: '100%',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      borderRadius: '10px 10px 0 0',
      overflow: 'hidden',
      ...style
    }

    const overlayStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '1rem'
    }

    if (imageUrl) {
      return (
        <div style={{
          ...baseStyle,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {overlayText && (
            <div style={overlayStyle}>
              {overlayText}
            </div>
          )}
        </div>
      )
    }

    // fallback 显示
    return (
      <div style={{
        ...baseStyle,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={overlayStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {fallbackIcon}
            </div>
            {overlayText && (
              <div style={{ fontSize: '0.9rem' }}>
                {overlayText}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333',
      lineHeight: '1.6'
    },
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '1rem 2rem'
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
    navLinks: {
      display: 'flex',
      gap: '2rem',
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    navLink: {
      color: '#666',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      fontSize: '0.95rem'
    },
    hero: {
      height: '80vh', // 减少高度，减少空白
      background: 'linear-gradient(135deg, rgba(44, 85, 48, 0.8), rgba(76, 129, 82, 0.6))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
      position: 'relative',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    heroContent: {
      maxWidth: '800px',
      padding: '0 2rem'
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '300',
      marginBottom: '1rem',
      letterSpacing: '2px'
    },
    heroSubtitle: {
      fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
      opacity: '0.9',
      marginBottom: '2rem',
      fontWeight: '300'
    },
    ctaButton: {
      display: 'inline-block',
      padding: '1rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '50px',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    compactSection: {
      padding: '2rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionTitleCompact: {
      fontSize: '2rem',
      textAlign: 'center',
      marginBottom: '0.5rem',
      color: '#2c5530',
      fontWeight: '300'
    },
    sectionSubtitle: {
      fontSize: '1.1rem',
      textAlign: 'center',
      marginBottom: '3rem',
      color: '#666',
      maxWidth: '600px',
      margin: '0 auto 3rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    cardContent: {
      padding: '2rem'
    },
    cardTitle: {
      fontSize: '1.4rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#2c5530'
    },
    cardSubtitle: {
      fontSize: '0.95rem',
      color: '#888',
      marginBottom: '1rem'
    },
    cardDescription: {
      fontSize: '0.95rem',
      color: '#666',
      lineHeight: '1.6'
    },
    priceTag: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#2c5530',
      marginTop: '1rem'
    },
    amenities: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    amenityTag: {
      backgroundColor: '#f0f8f0',
      color: '#2c5530',
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    experienceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // 更紧凑
      gap: '1.5rem',
      marginTop: '2rem' // 减少 margin
    },
    experienceCard: {
      textAlign: 'center',
      padding: '1.5rem', // 减少 padding
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)'
    },
    experienceIcon: {
      fontSize: '3rem',
      marginBottom: '1rem'
    }
  }

  return (
    <div style={styles.container}>
      {/* 导航栏 */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>🏠 梦想之家</div>
          <ul style={styles.navLinks}>
            <li><a href="#rooms" style={styles.navLink}>客房</a></li>
            <li><a href="#plans" style={styles.navLink}>套餐</a></li>
            <li><Link href="/dining" style={styles.navLink}>餐饮</Link></li>
            <li><a href="#experiences" style={styles.navLink}>体验</a></li>
            <li><Link href="/data-preview" style={styles.navLink}>数据</Link></li>
          </ul>
        </nav>
      </header>

      {/* 英雄区域 */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>梦想之家温泉民宿</h1>
          <p style={styles.heroSubtitle}>
            从废墟到梦想，180天重建奇迹<br />
            京郊私汤温泉 · 侘寂美学空间 · 有机养生料理
          </p>
          <a href="#rooms" style={styles.ctaButton}>
            探索客房
          </a>
        </div>
      </section>

      {/* 客房展示 */}
      <section id="rooms" style={styles.compactSection}>
        <h2 style={styles.sectionTitleCompact}>精选客房</h2>
        <p style={styles.sectionSubtitle}>
          每一间客房都是一个故事，每一次入住都是一段旅程
        </p>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2rem' }}>🔄</div>
            <p>加载客房信息中...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {rooms.map((room, index) => (
              <div key={index} style={styles.card}>
                <NotionImage
                  images={room.gallery}
                  alt={room.name}
                  fallbackIcon="🏠"
                  overlayText={room.name}
                />
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{room.name}</h3>
                  <p style={styles.cardSubtitle}>{room.subtitle}</p>
                  <p style={styles.cardDescription}>
                    {room.description ? 
                      (room.description.length > 100 ? 
                        room.description.substring(0, 100) + '...' : 
                        room.description) 
                      : '舒适温馨的住宿体验，享受宁静的温泉时光'}
                  </p>
                  <div style={styles.priceTag}>¥{room.price}/晚</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>
                    <span>👥 {room.capacity}人</span>
                    <span>📐 {room.size}㎡</span>
                  </div>
                  {room.amenities && room.amenities.length > 0 && (
                    <div style={styles.amenities}>
                      {room.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} style={styles.amenityTag}>{amenity}</span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span style={{...styles.amenityTag, backgroundColor: '#f0f0f0', color: '#666'}}>
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 独特体验 - 紧凑布局 */}
      <section id="experiences" style={{...styles.compactSection, backgroundColor: '#f8fffe'}}>
        <h2 style={styles.sectionTitleCompact}>独特体验</h2>
        <p style={styles.sectionSubtitle}>
          在自然中找回内心的宁静，在体验中发现生活的美好
        </p>
        
        <div style={styles.experienceGrid}>
          {experiences.map((experience, index) => (
            <div key={index} style={styles.experienceCard}>
              <div style={styles.experienceIcon}>{experience.icon || '✨'}</div>
              <h3 style={{...styles.cardTitle, fontSize: '1.2rem'}}>{experience.name}</h3>
              <p style={{...styles.cardDescription, fontSize: '0.9rem'}}>
                {experience.description ? 
                  (experience.description.length > 80 ? 
                    experience.description.substring(0, 80) + '...' : 
                    experience.description) 
                  : '独特的体验等您发现'}
              </p>
              {experience.duration > 0 && (
                <div style={{fontSize: '0.8rem', color: '#666', marginTop: '0.5rem'}}>
                  ⏱️ {experience.duration}分钟
                </div>
              )}
            </div>
          ))}
          
          {/* 如果体验数据不足，添加一些默认体验 */}
          {experiences.length < 3 && (
            <>
              <div style={styles.experienceCard}>
                <div style={styles.experienceIcon}>🧘‍♀️</div>
                <h3 style={{...styles.cardTitle, fontSize: '1.2rem'}}>晨间瑜伽</h3>
                <p style={{...styles.cardDescription, fontSize: '0.9rem'}}>
                  在山间薄雾中练习瑜伽，感受身心合一的宁静
                </p>
              </div>
              
              <div style={styles.experienceCard}>
                <div style={styles.experienceIcon}>🍃</div>
                <h3 style={{...styles.cardTitle, fontSize: '1.2rem'}}>森林疗愈</h3>
                <p style={{...styles.cardDescription, fontSize: '0.9rem'}}>
                  漫步原始森林，在大自然中释放压力与焦虑
                </p>
              </div>
              
              <div style={styles.experienceCard}>
                <div style={styles.experienceIcon}>🍵</div>
                <h3 style={{...styles.cardTitle, fontSize: '1.2rem'}}>茶道体验</h3>
                <p style={{...styles.cardDescription, fontSize: '0.9rem'}}>
                  学习传统茶艺，在一杯好茶中品味生活禅意
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 套餐计划 - 修复图片和布局 */}
      <section id="plans" style={styles.compactSection}>
        <h2 style={styles.sectionTitleCompact}>精选套餐</h2>
        <p style={styles.sectionSubtitle}>
          为不同需求精心定制的套餐体验
        </p>
        
        <div style={styles.grid}>
          {plans.map((plan, index) => {
            const imageUrl = getImageUrl(plan.images)
            return (
              <div key={index} style={styles.card}>
                <div 
                  style={{
                    ...styles.cardImage,
                    ...(imageUrl ? {
                      backgroundImage: `url(${imageUrl})`
                    } : {background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'})
                  }}
                >
                  <div style={styles.imageOverlay}>
                    📦
                  </div>
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{plan.name}</h3>
                  <p style={styles.cardDescription}>
                    {plan.description ? 
                      (plan.description.length > 120 ? 
                        plan.description.substring(0, 120) + '...' : 
                        plan.description) 
                      : '精心设计的套餐体验'}
                  </p>
                  <div style={styles.priceTag}>¥{plan.price} / {plan.duration}天</div>
                  {plan.popular && (
                    <div style={{...styles.amenityTag, backgroundColor: '#ffe7cc', color: '#cc6600', marginTop: '1rem', display: 'inline-block'}}>
                      🔥 热门推荐
                    </div>
                  )}
                  {plan.includes && (
                    <div style={{marginTop: '1rem', fontSize: '0.85rem', color: '#666'}}>
                      <strong>包含:</strong> {plan.includes.substring(0, 50)}...
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 快速导航区 */}
      <section style={{...styles.compactSection, backgroundColor: '#2c5530', color: 'white', textAlign: 'center'}}>
        <h2 style={{...styles.sectionTitleCompact, color: 'white', marginBottom: '2rem'}}>
          探索更多
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <Link href="/dining" style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: 'white',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🍽️</div>
            <h3>餐饮体验</h3>
            <p style={{fontSize: '0.9rem', opacity: 0.8}}>品味精致料理</p>
          </Link>
          
          <Link href="/data-preview" style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: 'white',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📊</div>
            <h3>数据管理</h3>
            <p style={{fontSize: '0.9rem', opacity: 0.8}}>查看详细信息</p>
          </Link>
          
          <Link href="/status" style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: 'white',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎯</div>
            <h3>项目状态</h3>
            <p style={{fontSize: '0.9rem', opacity: 0.8}}>开发进度</p>
          </Link>
        </div>
      </section>

      {/* 页脚 - 紧凑设计 */}
      <footer style={{backgroundColor: '#1a3a1f', color: 'white', padding: '2rem', textAlign: 'center'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h3 style={{marginBottom: '0.5rem'}}>梦想之家温泉民宿</h3>
          <p style={{opacity: '0.8', marginBottom: '1rem', fontSize: '0.9rem'}}>
            从废墟到梦想，每一天都在创造美好
          </p>
          <div style={{fontSize: '0.8rem', opacity: 0.6}}>
            © 2024 梦想之家 · Next.js + Notion + Vercel
          </div>
        </div>
      </footer>
    </div>
  )
}
