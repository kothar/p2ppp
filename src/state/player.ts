
const nodeCrypto = require('crypto');
const randomUUID = nodeCrypto.randomUUID;

export interface Player {
    name: string,
    uuid: string,
}

export function newPlayer(name: string): Player {
    return {
        name,
        uuid: randomUUID()
    };
}
