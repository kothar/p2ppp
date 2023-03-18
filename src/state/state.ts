const nodeCrypto = require('crypto');
const randomUUID = nodeCrypto.randomUUID;

import { Player } from '@/state/player';
import { Vote } from '@/state/vote';

export interface State {
    tableUuid: string,
    players: Record<string, Player>,
    votes: Record<string, Vote>,
    voteScheme: 'fibonacci',
    revealVotes: boolean
}

export type StateUpdate = Partial<State> & Pick<State, 'tableUuid'>

export function newState(tableUuid: string): State {
    return {
        tableUuid,
        players: {},
        votes: {},
        voteScheme: 'fibonacci',
        revealVotes: false,
    }
}

function findLatestVote(state: State) {
    // TODO
    return Object.keys(state.votes)[0] ?? state.tableUuid;
}

export function addVote(state: State, player: Player, value: number | '?'): StateUpdate {
    let voteId = randomUUID();
    return {
        tableUuid: state.tableUuid,
        votes: {
            [voteId]: {
                playerUuid: player.uuid,
                uuid: voteId,
                previousUuid: findLatestVote(state),
                value
            }
        }
    }
}

export function addPlayer(state: State, player: Player): StateUpdate {
    return {
        tableUuid: state.tableUuid,
        players: {
            [player.uuid]: player
        }
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
        voteScheme: newState.voteScheme ?? oldState.voteScheme,
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
