// composables/useTextSizing.js
import { ref, nextTick, onUnmounted } from 'vue'

export function useTextSizing() {
  const wordFontSizes = ref({})
  
  function calculateFontSizeToFit(
    text, 
    targetWidth, 
    fontFamily = '"Century Gothic"', 
    fontWeight = '700',
    letterSpacing = 2,
    uppercase = true,
    minSize = 36,
    maxSize = 200
  ) {
    if (!text || !targetWidth) return minSize
    
    const referenceSize = 20
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    context.font = `${fontWeight} ${referenceSize}px ${fontFamily}`
    const processedText = uppercase ? text.toUpperCase() : text
    const metrics = context.measureText(processedText)
    const measuredWidth = metrics.width
    if (measuredWidth === 0) return minSize
    
    const letterSpacingWidth = Math.max(0, processedText.length - 1) * letterSpacing
    const totalMeasuredWidth = measuredWidth + letterSpacingWidth
    let fontSize = (targetWidth / totalMeasuredWidth) * referenceSize
    fontSize = Math.max(minSize, Math.min(maxSize, fontSize))
    
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    const verificationMetrics = context.measureText(processedText)
    const verificationWidth = verificationMetrics.width
    const verificationLetterSpacingWidth = Math.max(0, processedText.length - 1) * letterSpacing
    const totalVerificationWidth = verificationWidth + verificationLetterSpacingWidth
    
    if (totalVerificationWidth > targetWidth) {
      const adjustmentFactor = targetWidth / totalVerificationWidth
      fontSize = fontSize * adjustmentFactor
      fontSize = Math.max(minSize, Math.min(maxSize, fontSize))
    }
    
    return fontSize
  }
  
  async function calculateWordFontSizes(containerElement, text, options = {}) {
    if (!containerElement || !text) return {}
    
    await nextTick()
    
    const containerWidth = containerElement.offsetWidth - 25
    const words = text.split('&')
    const fontSizes = []
    
    const defaults = {
      fontFamily: '"Century Gothic"',
      fontWeight: '700',
      letterSpacing: 2,
      uppercase: true,
      minSize: 36,
      maxSize: 86
    }
    
    const config = { ...defaults, ...options }
    
    words.forEach((word) => {
      const fontSize = calculateFontSizeToFit(
        word, 
        containerWidth,
        config.fontFamily,
        config.fontWeight,
        config.letterSpacing,
        config.uppercase,
        config.minSize,
        config.maxSize
      )
      fontSizes.push(fontSize)
    })
    
    return fontSizes
  }
  
  async function updateWordFontSizes(containerElement, text, options = {}) {
    const newFontSizes = await calculateWordFontSizes(containerElement, text, options)
    wordFontSizes.value = newFontSizes

    const spanElements = Array.from(containerElement.children)
    spanElements.forEach((span, id) => {
      if (id < wordFontSizes.value.length) {
        span.style.fontSize = wordFontSizes.value[id] + 'px'
      }
    })
  }
  
  function createResizeHandler(callback, delay = 150) {
    let timeoutId
    
    const debouncedHandler = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(callback, delay)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', debouncedHandler)
    }
    
    return () => {
      clearTimeout(timeoutId)
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', debouncedHandler)
      }
    }
  }
  
  function setupAutoResize(updateFunction, delay = 150) {
    const cleanup = createResizeHandler(updateFunction, delay)
    onUnmounted(cleanup)
    return cleanup
  }
  
  return {
    wordFontSizes,
    calculateFontSizeToFit,
    calculateWordFontSizes,
    updateWordFontSizes,
    createResizeHandler,
    setupAutoResize
  }
}