import { v4 as uuidv4 } from 'uuid';

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
