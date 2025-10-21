import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Status() {
  const [allData, setAllData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch('/api/test-notion')
        const data = await response.json()
        setAllData(data)
      } catch (error) {
        console.error('Error fetching status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fffe'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '3rem',
      color: '#2c5530',
      marginBottom: '1rem',
      fontWeight: '300'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#666',
      marginBottom: '2rem'
    },
    statusGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    statusCard: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
      border: '1px solid #f0f0f0'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#2c5530',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    successCard: {
      borderLeft: '5px solid #4caf50'
    },
    warningCard: {
      borderLeft: '5px solid #ff9800'
    },
    dataList: {
      listStyle: 'none',
      padding: 0,
      margin: '1rem 0'
    },
    dataItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0',
      borderBottom: '1px solid #f0f0f0'
    },
    badge: {
      padding: '0.3rem 0.8rem',
      borderRadius: '15px',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    successBadge: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32'
    },
    warningBadge: {
      backgroundColor: '#fff3e0',
      color: '#f57c00'
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginTop: '2rem'
    },
    button: {
      padding: '1rem 1.5rem',
      borderRadius: '10px',
      textDecoration: 'none',
      textAlign: 'center',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer'
    },
    primaryButton: {
      backgroundColor: '#2c5530',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f0f8f0',
      color: '#2c5530',
      border: '2px solid #2c5530'
    }
  }

  const databases = [
    { name: '客房管理', key: 'rooms', icon: '🏠', status: 'success' },
    { name: '套餐计划', key: 'plans', icon: '📦', status: 'success' },
    { name: '期刊文章', key: 'posts', icon: '📰', status: 'success' },
    { name: '独特体验', key: 'experiences', icon: '✨', status: 'success' },
    { name: '菜系餐厅', key: 'cuisines', icon: '🍽️', status: 'success' },
    { name: '招牌菜品', key: 'dishes', icon: '🥘', status: 'success' },
    { name: '主厨团队', key: 'chefs', icon: '👨‍🍳', status: 'success' },
    { name: '品牌故事', key: 'stories', icon: '📖', status: 'warning' }
  ]

  const features = [
    { name: '首页设计', status: 'completed', description: '响应式设计，现代化UI' },
    { name: '客房展示', status: 'completed', description: '动态数据加载，精美卡片布局' },
    { name: '餐饮页面', status: 'completed', description: '完整的菜系、菜品、主厨展示' },
    { name: '数据预览', status: 'completed', description: '所有数据的可视化管理' },
    { name: 'API接口', status: 'completed', description: 'RESTful API，支持所有数据类型' },
    { name: 'SEO优化', status: 'pending', description: '待优化meta标签和结构化数据' },
    { name: 'Vercel部署', status: 'pending', description: '准备部署到生产环境' }
  ]

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔄</div>
          <p>加载状态信息中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🏠 梦想之家项目概览</h1>
        <p style={styles.subtitle}>
          从概念到现实，全栈温泉民宿网站开发完成度报告
        </p>
        
        {allData && allData.success && (
          <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#4caf50'}}>
                {allData.stats?.databases || 8}
              </div>
              <div style={{fontSize: '0.9rem', color: '#666'}}>数据库</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2196f3'}}>
                {allData.stats?.totalRecords || 0}
              </div>
              <div style={{fontSize: '0.9rem', color: '#666'}}>数据记录</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ff9800'}}>
                5
              </div>
              <div style={{fontSize: '0.9rem', color: '#666'}}>页面</div>
            </div>
          </div>
        )}
      </header>

      <div style={styles.statusGrid}>
        {/* 数据库状态 */}
        <div style={{...styles.statusCard, ...styles.successCard}}>
          <h3 style={styles.cardTitle}>
            🗄️ 数据库状态
          </h3>
          <ul style={styles.dataList}>
            {databases.map((db, index) => (
              <li key={index} style={styles.dataItem}>
                <span>{db.icon} {db.name}</span>
                <span style={{
                  ...styles.badge,
                  ...(db.status === 'success' ? styles.successBadge : styles.warningBadge)
                }}>
                  {allData?.stats?.coreData?.[db.key] || 
                   allData?.stats?.brandData?.[db.key] || 
                   allData?.stats?.diningData?.[db.key] || 
                   '0'} 条数据
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 功能完成度 */}
        <div style={{...styles.statusCard, ...styles.successCard}}>
          <h3 style={styles.cardTitle}>
            ⚡ 功能完成度
          </h3>
          <ul style={styles.dataList}>
            {features.map((feature, index) => (
              <li key={index} style={styles.dataItem}>
                <div>
                  <div style={{fontWeight: '500'}}>{feature.name}</div>
                  <div style={{fontSize: '0.85rem', color: '#666'}}>{feature.description}</div>
                </div>
                <span style={{
                  ...styles.badge,
                  ...(feature.status === 'completed' ? styles.successBadge : styles.warningBadge)
                }}>
                  {feature.status === 'completed' ? '✅ 完成' : '🔄 待办'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 技术栈 */}
        <div style={styles.statusCard}>
          <h3 style={styles.cardTitle}>
            🛠️ 技术架构
          </h3>
          <ul style={styles.dataList}>
            <li style={styles.dataItem}>
              <span>前端框架</span>
              <span style={styles.successBadge}>Next.js 14</span>
            </li>
            <li style={styles.dataItem}>
              <span>数据管理</span>
              <span style={styles.successBadge}>Notion API</span>
            </li>
            <li style={styles.dataItem}>
              <span>样式方案</span>
              <span style={styles.successBadge}>CSS-in-JS</span>
            </li>
            <li style={styles.dataItem}>
              <span>部署平台</span>
              <span style={styles.warningBadge}>Vercel (待部署)</span>
            </li>
            <li style={styles.dataItem}>
              <span>CDN加速</span>
              <span style={styles.warningBadge}>Cloudflare (待配置)</span>
            </li>
          </ul>
        </div>

        {/* 下一步计划 */}
        <div style={styles.statusCard}>
          <h3 style={styles.cardTitle}>
            🎯 下一步计划
          </h3>
          <ul style={{...styles.dataList, listStyle: 'disc', paddingLeft: '1rem'}}>
            <li style={{marginBottom: '0.5rem'}}>完善品牌故事数据</li>
            <li style={{marginBottom: '0.5rem'}}>添加SEO优化</li>
            <li style={{marginBottom: '0.5rem'}}>创建第四批数据库</li>
            <li style={{marginBottom: '0.5rem'}}>部署到Vercel</li>
            <li style={{marginBottom: '0.5rem'}}>配置自定义域名</li>
            <li style={{marginBottom: '0.5rem'}}>性能优化</li>
          </ul>
        </div>
      </div>

      {/* 快捷操作 */}
      <div style={styles.actionButtons}>
        <Link href="/" style={{...styles.button, ...styles.primaryButton}}>
          🏠 查看首页
        </Link>
        <Link href="/dining" style={{...styles.button, ...styles.primaryButton}}>
          🍽️ 餐饮页面
        </Link>
        <Link href="/data-preview" style={{...styles.button, ...styles.secondaryButton}}>
          📊 数据预览
        </Link>
        <a href="/api/test-notion" style={{...styles.button, ...styles.secondaryButton}}>
          🔗 API测试
        </a>
      </div>

      <footer style={{textAlign: 'center', marginTop: '3rem', padding: '2rem', color: '#666'}}>
        <p>🎉 <strong>梦想之家温泉民宿网站</strong> - 从概念到现实的完整实现</p>
        <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
          Next.js + Notion + Vercel + Cloudflare 全栈解决方案
        </p>
      </footer>
    </div>
  )
}
