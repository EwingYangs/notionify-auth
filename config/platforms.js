// 平台配置
export const platforms = [
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'weread', label: '微信读书' },
  { value: 'flomo', label: 'flomo' },
  { value: 'jike', label: '即刻' }
]

// 获取平台显示名称
export const getPlatformLabel = (value) => {
  const platform = platforms.find(p => p.value === value)
  return platform ? platform.label : value
}

// 获取平台值
export const getPlatformValue = (label) => {
  const platform = platforms.find(p => p.label === label)
  return platform ? platform.value : label
} 