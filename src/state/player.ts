import WebCrypto from 'tiny-webcrypto';
const randomUUID = WebCrypto.randomUUID();

export interface Player {
    name: string,
    uuid: string,
}

export function newPlayer(name: string): Player {
    return {
        name,
        uuid: randomUUID
    };
}
