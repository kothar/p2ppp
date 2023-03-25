import faunadb from 'faunadb';
import { Player } from '@/state/player';

const q = faunadb.query;

// Acquire the secret and optional endpoint from environment variables
const secret = process.env.FAUNADB_SECRET;
const endpoint = process.env.FAUNADB_ENDPOINT || 'https://db.us.fauna.com';
const collectionName = process.env.FAUNADB_COLLECTION || 'players';
const tableIndex = process.env.FAUNADB_PLAYER_INDEX || 'table';
const playerIndex = process.env.FAUNADB_PLAYER_INDEX || 'player';

if (typeof secret === 'undefined' || secret === '') {
    console.error('The FAUNADB_SECRET environment variable is not set, exiting.');
    process.exit(1);
}

let mg, domain, port, scheme
if ((mg = endpoint.match(/^(https?):\/\/([^:]+)(:(\d+))?/))) {
    scheme = mg[1] as 'http' | 'https' || 'https'
    domain = mg[2] || 'db.fauna.com'
    port = parseInt(mg[4]) || 443
}

// Instantiate a client
const client = new faunadb.Client({
    secret: secret,
    domain: domain,
    port: port,
    scheme: scheme,
})

export async function getPlayers(tableUuid: string): Promise<Player[]> {
    console.log(`Fetching players for table ${tableUuid}`);
    const ret: { data: [string, string][] } = await client.query(
        q.Paginate(q.Match(q.Index(tableIndex), tableUuid), { size: 50 })
    );
    return ret.data.map(([uuid, name]) => ({ uuid, name }));
}

export async function storePlayer(tableUuid: string, player: Player) {
    console.log(`Updating player ${player.uuid} for table ${tableUuid}`);
    await client.query(
        q.Let(
            {
                docRef: q.Match(q.Index(playerIndex), tableUuid, player.uuid),
                docData: { tableUuid, playerUuid: player.uuid, playerName: player.name }
            },
            q.If(
                q.Exists(q.Var('docRef')),
                q.Update(
                    q.Select(['data', 0, 2], q.Paginate(q.Var('docRef'), { size: 1 })),
                    { data: q.Var('docData') }),
                q.Create(q.Collection(collectionName), { data: q.Var('docData') })
            )
        )
    );
}
