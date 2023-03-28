import { getPlayers, storePlayer } from '@/db/tablePlayers';
import { validate } from 'uuid';
import assert from 'assert';
import { NextRequest } from 'next/server';

export async function GET(request: Request, context: { params: { tid: string } }) {
    const { tid } = context.params;
    assert.ok(validate(tid));

    const players = await getPlayers(tid);
    return new Response(JSON.stringify(players));
}

export async function POST(request: NextRequest, context: { params: { tid: string } }) {
    const { tid } = context.params;
    assert.ok(validate(tid));

    const { uuid, name } = await request.json();
    assert.ok(validate(uuid));
    assert.match(name, /[\w\s]/);

    const player = { uuid, name };
    await storePlayer(tid, player);
    return new Response(JSON.stringify({ result: 'success' }));
}
