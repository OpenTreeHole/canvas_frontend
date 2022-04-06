export const timeDifference = (v) => {
  if (!v) {
    return ''
  }
  const date = new Date(v)
  const now = new Date()

  let seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 0) {
    seconds = 0
  }
  if (seconds < 60) {
    return seconds + '秒前'
  } else if (seconds < 3600) {
    return Math.floor(seconds / 60) + '分钟前'
  } else if (seconds < 86400) {
    return Math.floor(seconds / 3600) + '小时前'
  } else if (seconds < 604800) {
    return Math.floor(seconds / 86400) + '天前'
  } else if (date.getFullYear() === now.getFullYear()) {
    return v.substring(5, 10)
  } else {
    return v.substring(0, 10)
  }
}
