import { SocialNetwork } from "../types"
import { classNames } from '../utils/index';

type DevTreeLinkProps = {
    link: SocialNetwork
}


export const DevTreeLink = ({link}: DevTreeLinkProps) => {
  return (
    <li className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg">
        <div
        className="w-12 h-12 bg-cover"
        style={{backgroundImage: `url('/social/icon_${link.name}.svg')`}}
        ></div>
        <p className="capitalize">Visita mi: <span className="font-bold">{link.name}</span> </p>
    </li>
  )
}
