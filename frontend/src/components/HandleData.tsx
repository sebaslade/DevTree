import type { SocialNetwork, UserHandle } from "../types"
import FollowButton from "./FollowButton"

type HandleDataProps = {
    data: UserHandle
    isFollowingInitially: boolean
}

export default function HandleData({ data, isFollowingInitially }: HandleDataProps) {
    let links: SocialNetwork[] = []

    try {
        links = JSON.parse(data.links || '[]').filter((link: SocialNetwork) => link.enabled)
    } catch (error) {
        console.error("Error al parsear los links:", error)
        links = []
    }
    return (
        <div className="space-y-6 text-white">
            <p className="text-5xl text-center font-black">{data.handle}</p>
            {data.image && <img src={data.image} className="max-w-[250px] mx-auto" />}
            <p className="text-center text-lg font-bold">{data.followersCount}</p>
            <div 
            className="flex items-center justify-center gap-2 text-lg font-bold">
                <FollowButton
                profileHandle={data.handle}
                isFollowingInitially={isFollowingInitially}
            />
            </div>
            
            <p className="text-center text-sm text-gray-300">Visitas: {data.visits}</p>
            <p className="text-lg text-center font-bold">{data.description}</p>
            <div className="mt-20 flex flex-col gap-6">
                {links.length ?  
                    links.map(link => (
                        <a
                            key={link.name}
                            className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg"
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <img src={`/social/icon_${link.name}.svg`} alt="imagen red social" className="w-12" />
                            <p className="text-black capitalize font-bold text-lg">Visita mi: {link.name}</p>
                            
                        </a>
                    ))
                : <p className="text-center">No hay enlaces en este perfil</p>}
            </div>

        </div>
    )
}
