import { Player } from '@/state/player';
import { Vote } from '@/state/vote';

export interface State {
    tableUuid: string,
    players: Record<string, Player>,
    votes: Record<string, Vote>,
    revealVotes: boolean
}

export type StateUpdate = Partial<State> & Pick<State, 'tableUuid'>

export function newState(tableUuid: string, player: Player): State {
    return {
        tableUuid,
        players: { [player.uuid]: player },
        votes: {},
        revealVotes: false,
    }
}

export function mergeState(oldState: State, newState: StateUpdate): State {
    if (oldState.tableUuid !== newState.tableUuid) {
        throw new Error('Invalid state update: tableUuid does not match');
    }

    return {
        tableUuid: oldState.tableUuid,
        players: mergePlayers(oldState.players, newState.players),
        votes: mergeVotes(oldState.votes, newState.votes),
        revealVotes: newState.revealVotes ?? oldState.revealVotes
    }
}

function mergePlayers(oldPlayers: Record<string, Player>, newPlayers?: Record<string, Player>) {
    if (!newPlayers) return oldPlayers;

    return {
        ...oldPlayers,
        ...newPlayers
    };
}

function mergeVotes(oldVotes: Record<string, Vote>, newVotes?: Record<string, Vote>) {
    if (!newVotes) return oldVotes;

    return {
        ...oldVotes,
        ...newVotes
    };
}
