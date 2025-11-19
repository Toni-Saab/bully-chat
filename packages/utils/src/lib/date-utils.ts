// packages/utils/src/lib/date-utils.ts

export const getChatDateGroup = (dateString: string): string => {
  if (!dateString) return 'Older'
    
  const date = new Date(dateString)
  const now = new Date()

  const startOfDay = (d: Date) => {
    const s = new Date(d)
    s.setHours(0, 0, 0, 0)
    return s
  }

  const todayTime = startOfDay(now).getTime()
  const chatDayTime = startOfDay(date).getTime()

  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (chatDayTime >= todayTime) {
    return 'Today'
  }

  if (diffInDays === 1) {
    return 'Yesterday'
  }
  
  if (diffInDays > 1 && diffInDays <= 7) {
    return 'Last 7 days'
  }
  
  if (diffInDays > 7 && diffInDays <= 30) {
    return 'Last 30 days'
  }
  
  return 'Older'
}
