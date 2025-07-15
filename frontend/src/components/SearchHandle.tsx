import { useState, useEffect } from 'react'
import api from '../config/axios'

interface UserPreview {
    handle: string
}

export default function UserSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserPreview[]>([])

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
        if (query.trim().length > 0) {
        try {
            const { data } = await api.get(`/search?q=${query}`)
            setResults(data)
        } catch (err) {
            console.error(err)
        }
        } else {
        setResults([])
        }
    }, 300)
    return () => clearTimeout(delayDebounce)
    }, [query])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        if (results.length > 0) {
            // Redirigir al primer resultado
            window.location.href = `/${results[0].handle}`
        } else {
            // Si no hay resultados, mandar a pantalla de error
            window.location.href = '/404'
        }
        }
    }

  return (
    <div className="relative w-96 mx-auto">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar usuario"
        className="border rounded px-3 py-2 w-full"
      />
      {results.length > 0 && (
        <ul className="absolute bg-white border rounded shadow w-full mt-1">
          {results.map((user: any) => (
            <li
              key={user.handle}
              className="p-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                // redirige a la página de perfil:
                window.location.href = `/${user.handle}`
              }}
            >
              {user.image && (
                <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
              )}
              <span className="font-bold">@{user.handle}</span>
              <span className="text-gray-500">{user.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
