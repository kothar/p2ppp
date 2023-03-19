import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie'
import { Dispatch, SetStateAction, useState } from 'react';

const cookieName = 'yapp-player';

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

export function usePlayer(): [Player, (player: Player) => void] {
    const [player, setPlayer] = useState(() => {
        const cookie = Cookies.get(cookieName);
        if (cookie) {
            return JSON.parse(cookie) as Player;
        }

        return newPlayer('Player');
    });

    return [player, (newPlayer: Player) => {
        setPlayer(newPlayer);
        Cookies.set(cookieName, JSON.stringify(newPlayer));
    }];
}

