import faunadb from 'faunadb';
import { Player } from '@/state/player';

const q = faunadb.query;

// Acquire the secret and optional endpoint from environment variables
const secret = process.env.FAUNADB_SECRET;
const endpoint = process.env.FAUNADB_ENDPOINT || 'https://db.us.fauna.com';
const collectionName = process.env.FAUNADB_COLLECTION || 'tablePlayers';
const indexName = process.env.FAUNADB_COLLECTION || 'tableUuid';

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
        q.Paginate(q.Match(q.Index(indexName), tableUuid))
    );
    return ret.data.map(([uuid, name]) => ({ uuid, name }));
}

export async function storePlayer(tableUuid: string, player: Player) {
    const res = await client.query(
        q.Create(
            q.Collection(collectionName),
            { data: { tableUuid, playerUuid: player.uuid, playerName: player.name } },
        )
    );
}
