import { v4 as uuidv4 } from 'uuid';

import { Player } from '@/state/player';
import { Vote } from '@/state/vote';

export interface State {
    tableUuid: string,
    players: Record<string, Player>,
    votes: Record<string, Vote>,
    voteScheme: 'fibonacci',
    revealVotes: boolean
}

export type StateUpdate = Partial<State> & Pick<State, 'tableUuid'> & { resetVotes?: boolean }

export function isStateUpdate(state: any): state is StateUpdate {
    return state && state.tableUuid;
}

export function newState(tableUuid: string, players: Record<string, Player>): State {
    return {
        tableUuid,
        players,
        votes: {},
        voteScheme: 'fibonacci',
        revealVotes: false,
    }
}

function findLatestVote(state: State) {
    // TODO find vote with most ancestors
    return Object.keys(state.votes)[0] ?? state.tableUuid;
}

function resolveVotes(state: State) {
    // TODO apply votes in order
    const votes: Record<string, Vote> = {}
    Object.values(state.votes).forEach(vote => {
        votes[vote.playerUuid] = vote;
    })
    return votes;
}

/**
 * Identify the most recent vote for a player in the state
 */
export function playerVote(state: State, player: Player): Vote | undefined {
    return resolveVotes(state)[player.uuid];
}

export function addVote(state: State, player: Player, value: number | '?'): StateUpdate {
    let voteId = uuidv4();
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
        votes: newState.resetVotes ? {} : mergeVotes(oldState.votes, newState.votes),
        voteScheme: newState.voteScheme ?? oldState.voteScheme,
        revealVotes: newState.resetVotes ? false : newState.revealVotes ?? oldState.revealVotes
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
