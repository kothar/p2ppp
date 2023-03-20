import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie'

export const playerCookie = 'yapp-player';

export interface Player {
    name: string,
    uuid: string,
}

export function newPlayer(name: string): Player {
    return {
        name,
        uuid: uuidv4()
    };
}

export function getPlayerCookie(): Player {
    const cookie = Cookies.get(playerCookie);
    const player = (cookie && JSON.parse(cookie)) as Player;

    return player ?? newPlayer('Player');
}

export function setPlayerCookie(newPlayer: Player) {
    Cookies.set(playerCookie, JSON.stringify(newPlayer));
}

