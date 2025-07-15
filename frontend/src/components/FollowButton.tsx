import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect } from 'react';

// Estas funciones llaman a tus endpoints
async function followUser(handle: string) {
    const token = localStorage.getItem("AUTH_TOKEN");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/follow/${handle}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }

    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al seguir')
    }
    return await res.json()
}

async function unfollowUser(handle: string) {
    const token = localStorage.getItem("AUTH_TOKEN");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/unfollow/${handle}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al dejar de seguir')
    }
    return await res.json()
}

type FollowButtonProps = {
  profileHandle: string
  isFollowingInitially: boolean
}

export default function FollowButton({ profileHandle, isFollowingInitially }: FollowButtonProps) {
  const queryClient = useQueryClient()
  const [isFollowing, setIsFollowing] = useState(isFollowingInitially)

  // sincronizar cuando cambie el prop
  useEffect(() => {
    setIsFollowing(isFollowingInitially)
  }, [isFollowingInitially])

  const followMutation = useMutation({
    mutationFn: () => followUser(profileHandle),
    onSuccess: () => {
      toast.success(`Ahora sigues a @${profileHandle}`)
      setIsFollowing(true)
      queryClient.invalidateQueries({ queryKey: ['user', profileHandle] })
    },
    onError: (error: any) => toast.error(error.message)
  })

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(profileHandle),
    onSuccess: () => {
      toast.success(`Has dejado de seguir a @${profileHandle}`)
      setIsFollowing(false)
      queryClient.invalidateQueries({ queryKey: ['handle', profileHandle] }) // 👈 usa la misma key
    },
    onError: (error: any) => toast.error(error.message)
  })

  const handleClick = () => {
    if (isFollowing) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={followMutation.isPending || unfollowMutation.isPending}
      className={`px-4 py-2 rounded-lg font-bold transition ${
        isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
      }`}
    >
      {followMutation.isPending || unfollowMutation.isPending
        ? 'Cargando...'
        : isFollowing
        ? 'Dejar de seguir'
        : 'Seguir'}
    </button>
  )
}

