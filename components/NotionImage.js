import { useState } from 'react'

export default function NotionImage({ 
  images, 
  alt, 
  fallbackIcon = '🏠', 
  style = {},
  overlayText = null 
}) {
  const [imageError, setImageError] = useState(false)
  
  // 获取第一张可用图片的URL
  const getImageUrl = () => {
    if (!images || images.length === 0) return null
    
    const image = images[0]
    if (image.type === 'file') {
      return image.file?.url || null
    } else if (image.type === 'external') {
      return image.external?.url || null
    }
    return null
  }

  const imageUrl = getImageUrl()
  
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

  if (imageUrl && !imageError) {
    return (
      <div style={{
        ...baseStyle,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <img 
          src={imageUrl} 
          alt={alt}
          style={{ display: 'none' }}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
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
