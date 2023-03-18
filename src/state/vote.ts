export interface Vote {
    playerUuid: string,
    previousUuid: string,
    uuid: string,
    value: number | '?',
}
