import { getPlayers } from '@/db/tablePlayers';

export async function GET(request: Request, context: { params: { tid: string } }) {
    console.log(context.params);
    const players = await getPlayers(context.params.tid);
    return new Response(JSON.stringify(players));
}
