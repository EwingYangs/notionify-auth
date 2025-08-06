// 平台配置
export const platforms = [
  { value: 'xiaohongshu', label: '小红书', tutorialLink: 'https://blog.notionedu.com/article/20e73415-a279-80d5-81ce-d87b9884cc14' },
  { value: 'weread', label: '微信读书', tutorialLink: 'https://blog.notionedu.com/article/22d73415-a279-801c-8b4e-f2503e0ef65b' },
  { value: 'flomo', label: 'flomo', tutorialLink: 'https://blog.notionedu.com/article/23a73415-a279-802f-a5bd-f15b1b5a8622' },
  { value: 'jike', label: '即刻', tutorialLink: 'https://blog.notionedu.com/article/24673415-a279-80bf-b146-f7fd2cfb368e' }
]

// 获取平台显示名称
export const getPlatformLabel = (value) => {
  const platform = platforms.find(p => p.value === value)
  return platform ? platform.label : value
}

// 获取平台教程链接
export const getPlatformTutorialLink = (value) => {
  const platform = platforms.find(p => p.value === value)
  return platform ? platform.tutorialLink : ''
}

// 获取平台值
export const getPlatformValue = (label) => {
  const platform = platforms.find(p => p.label === label)
  return platform ? platform.value : label
} 