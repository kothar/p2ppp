import {newPlayer, Player} from '@/state/player';
import {addPlayer, addVote, mergeState, newState, nextRound, State, updateRevealVotes} from '@/state/state';
import {Vote} from '@/state/vote';

const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

describe('Player', () => {
    const bob = newPlayer('bob');

    test('new Player created successfully', () => {
        expect(bob.name).toEqual('bob');
        expect(bob.uuid).toMatch(uuidRegex);
    });

    test('addPlayer creates valid update', () => {
        const state = newState('table', {});
        const playerUpdate = addPlayer(state, bob);

        expect(playerUpdate.players).toBeDefined();
        expect(Object.keys(playerUpdate.players!).length).toEqual(1);

        const [key, player] = Object.entries(playerUpdate.players!)[0];
        expect(key).toEqual(player.uuid);
        expect(player).toEqual(bob);
    });

    test('updateState adds player', () => {
        const state = newState('table', {});
        const playerUpdate = addPlayer(state, bob);

        const state2 = mergeState(state, playerUpdate);
        expect(state2.tableUuid).toEqual(state.tableUuid);
        expect(Object.keys(state2.players).length).toEqual(1);

        const player = state2.players[bob.uuid];
        expect(player).toEqual(bob);
    });
});

describe('Vote', () => {
    const bob = newPlayer('bob');
    const carol = newPlayer('carol');

    test('addVote creates valid update', () => {
        const state = newState('table', {});
        const voteUpdate = addVote(state, bob, 1);

        expect(voteUpdate.votes).toBeDefined();
        expect(Object.keys(voteUpdate.votes!).length).toEqual(1);

        const [key, vote] = Object.entries(voteUpdate.votes!)[0];
        expect(key).toEqual(vote.uuid);
        expect(vote).toEqual(expect.objectContaining<Partial<Vote>>({
            playerUuid: bob.uuid,
            previousUuid: state.tableUuid,
            value: 1
        }));
    });

    test('addVote selects valid previous vote', () => {
        let state = newState('table', {});
        const voteUpdate1 = addVote(state, carol, 1);
        state = mergeState(state, voteUpdate1);
        const voteUpdate2 = addVote(state, bob, 2);

        const [key1] = Object.entries(voteUpdate1.votes!)[0];
        const [key2, vote2] = Object.entries(voteUpdate2.votes!)[0];
        expect(key2).toEqual(vote2.uuid);
        expect(vote2).toEqual(expect.objectContaining<Partial<Vote>>({
            playerUuid: bob.uuid,
            previousUuid: key1,
            value: 2
        }));
    });

    test('updateState adds vote', () => {
        const state = newState('table', {});
        const voteUpdate = addVote(state, bob, 1);

        const state2 = mergeState(state, voteUpdate);
        expect(state2.tableUuid).toEqual(state.tableUuid);
        expect(Object.keys(state2.votes).length).toEqual(1);

        const [key, vote] = Object.entries(state2.votes)[0];
        expect(key).toEqual(vote.uuid);
        expect(vote).toEqual(voteUpdate.votes![key]);
    });
});

describe('State', () => {
    test('revealVotes merged to state', () => {
        const state = newState('table', {});
        const state2 = mergeState(state, updateRevealVotes(state, true));

        expect(state).toEqual(expect.objectContaining<Partial<State>>({
            tableUuid: 'table',
            revealVotes: false
        }));

        expect(state2).toEqual(expect.objectContaining<Partial<State>>({
            tableUuid: 'table',
            revealVotes: true
        }));
    });

    test('new round resets votes', () => {
        const state = newState('table', {});
        const vote = {playerUuid: "player1", previousUuid: "table", uuid: "vote", value: 3};
        state.votes['vote1'] = vote;
        const state2 = mergeState(state, nextRound(state));

        expect(state).toEqual(expect.objectContaining<Partial<State>>({
            tableUuid: 'table',
            round: 1,
            votes: {'vote1': vote}
        }));

        expect(state2).toEqual(expect.objectContaining<Partial<State>>({
            tableUuid: 'table',
            round: 2,
            votes: {}
        }));
    });
});
