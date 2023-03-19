import { getPlayers, storePlayer } from '@/db/tablePlayers';
import { newPlayer, Player } from '@/state/player';
import { v4 } from 'uuid';

describe.skip('FaunaDB', () => {
    const tableUuid = `test-${v4()}`;
    const player1 = newPlayer('player1');
    const player2 = newPlayer('player2');

    test('Lists players', async () => {
        const players = await getPlayers(tableUuid);
        expect(players).toBeDefined();
    })

    test('Stores player', async () => {
        // Player not in DB
        let players = await getPlayers(tableUuid);
        expect(players).toEqual(expect.not.arrayContaining<Player>([player1]));

        // Store Player
        await storePlayer(tableUuid, player1);

        // Player 1 in DB
        players = await getPlayers(tableUuid);
        expect(players).toContainEqual(player1);

        // Player 2 not in DB
        expect(players).toEqual(expect.not.arrayContaining<Player>([player2]));
    })
});
