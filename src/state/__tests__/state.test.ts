import { newPlayer } from '@/state/player';

const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

describe('Player', () => {
    test('newPlayer', () => {
        const person = newPlayer('bob');

        expect(person.name).toEqual('bob');
        expect(person.uuid).toMatch(uuidRegex);
    })
})
