import styles from './page.module.css'
import { Player, playerCookie } from '@/state/player';
import Table from '@/components/Table';
import { cookies } from 'next/headers';
import { getPlayers, storePlayer } from '@/db/tablePlayers';

async function fetchPlayers(table: string) {
    const players = await getPlayers(table);
    return Object.fromEntries(players.map(player => [player.uuid, player]));
}

function getServerPlayer() {
    const cookie = cookies().get(playerCookie);
    if (cookie) {
        return JSON.parse(cookie.value) as Player;
    }
    return undefined;
}

export default async function Home({ params }: { params: { table: string } }) {
    const { table } = params;

    const players = await fetchPlayers(table);
    const player = getServerPlayer();
    if (player) {
        if (players[player.uuid]?.name !== player.name) {
            players[player.uuid] = player;
            await storePlayer(table, player);
        }
    }

    return (
        <main className={styles.main}>
            <Table table={table} player={player} players={players}></Table>
        </main>
    )
}
