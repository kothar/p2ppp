import { getPlayers } from '@/db/tablePlayers';

export async function GET(request: Request, context: { params: { tid: string } }) {
    const { tid } = context.params;
    const players = await getPlayers(tid);
    return new Response(JSON.stringify(players));
}
