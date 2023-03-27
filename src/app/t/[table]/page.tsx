import styles from './page.module.css'
import { newPlayer, Player, playerCookie } from '@/state/player';
import Table from '@/components/Table';
import { cookies } from 'next/headers';
import { getPlayers, storePlayer } from '@/db/tablePlayers';

async function fetchPlayers(table: string) {
    const players = await getPlayers(table);
    return Object.fromEntries(players.map(player => [player.uuid, player]));
}

function getServerPlayer() {
    const cookie = cookies().get(playerCookie);
    return (cookie && JSON.parse(cookie.value)) as Player ?? newPlayer('Player');
}

export default async function Home({ params }: { params: { table: string } }) {
    const { table } = params;

    const player = getServerPlayer();
    const players = await fetchPlayers(table);
    if (players[player.uuid]?.name !== player.name) {
        players[player.uuid] = player;
        await storePlayer(table, player);
    }

    return (
        <main className={styles.main}>
            <Table table={table} player={player} players={players}></Table>
        </main>
    )
}
