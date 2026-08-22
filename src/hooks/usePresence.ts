import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function usePresence(userId: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    if (!userId) return

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const onlineIds = Object.keys(state)
        setOnlineUsers(onlineIds)
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers((current) => Array.from(new Set([...current, key])))
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers((current) => current.filter((id) => id !== key))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return onlineUsers
}
