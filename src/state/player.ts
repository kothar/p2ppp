import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie'

export const playerCookie = 'p2ppp-player';

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

export function getPlayerCookie(): Player | undefined {
    const cookie = Cookies.get(playerCookie);
    if (cookie) {
        return JSON.parse(cookie) as Player;
    }
    return undefined;
}

export function setPlayerCookie(newPlayer: Player) {
    Cookies.set(playerCookie, JSON.stringify(newPlayer), {
        expires: 30
    });
}

