'use client';

import { addPlayer, addVote, mergeState, newState, playerVote } from '@/state/state';
import { useState } from 'react';
import { Player, setPlayerCookie } from '@/state/player';
import styles from './Table.module.css'
import { Inter } from 'next/font/google';
import { PeerGroup } from '@/peer-group/PeerGroup';

const inter = Inter({ subsets: ['latin'] })

const voteSchemes: Record<string, Array<number | '?'>> = {
    fibonacci: [1, 2, 3, 5, 8, 13, '?']
};

const SSR = typeof self === 'undefined';

export default function Table(props: { player: Player, players: Record<string, Player>, table: string }) {
    const { players, table } = props;

    const [peerGroup] = useState(() => new PeerGroup(props.player, players));

    const [state, setState] = useState(newState(table, players));
    const [player, setPlayer] = useState(props.player);

    function updatePlayer(player: Player) {
        setPlayerCookie(player);
        setPlayer(player)

        const update = addPlayer(state, player);
        // TODO send update to group
        // TODO send update to server
        let nextState = mergeState(state, update);
        setState(nextState);
    }

    function editPlayerName() {
        const newName = prompt('Enter new player name', player?.name ?? 'Player');
        if (newName) {
            updatePlayer({
                ...player,
                name: newName
            })
        }
    }

    function updateVote(value: number | '?') {
        const update = addVote(state, player, value);
        // TODO send update to group
        const nextState = mergeState(state, update);
        setState(nextState);
    }

    function revealVotes(reveal = true) {
        const update = { tableUuid: state.tableUuid, revealVotes: reveal };
        // TODO send update to group
        const nextState = mergeState(state, update);
        setState(nextState);
    }

    function resetVotes() {
        const update = { tableUuid: state.tableUuid, resetVotes: true };
        // TODO send update to group
        const nextState = mergeState(state, update);
        setState(nextState);
    }

    return <>
        <div className={styles.description}>
            <a href="/">P2PPP - Peer to Peer Planning Poker</a>
            <div>
                {state.tableUuid}: <span onClick={editPlayerName}>{player.name}</span>
            </div>
        </div>

        <div className={styles.center}>
            {Object.values(state.players).map(player => {
                const vote = playerVote(state, player);
                return <div className={styles.card} key={player.uuid}>
                    <p className={inter.className}>{player.name}</p>
                    <h2 className={inter.className}>{state.revealVotes ? vote?.value ?? '?' : (vote ? '✔' : '⋯')}</h2>
                </div>
            })}
            {state.revealVotes ?
                <div className={styles.card} onClick={() => revealVotes(false)}>
                    <h2 className={inter.className}>Hide</h2>
                </div> :
                <div className={styles.card} onClick={() => revealVotes()}>
                    <h2 className={inter.className}>Reveal</h2>
                </div>
            }
        </div>

        <div className={styles.grid}>
            {state.revealVotes ?
                <div className={styles.card} onClick={() => resetVotes()}>
                    <p className={inter.className}>Voting complete</p>
                    <h2 className={inter.className}>Reset</h2>
                </div> :
                <>
                    <div className={styles.card}>
                        <p className={inter.className}>Scheme</p>
                        <h2 className={inter.className}>{state.voteScheme}</h2>
                    </div>
                    {voteSchemes[state.voteScheme].map(value => {
                        return <div key={value} className={styles.card}
                                    onClick={() => updateVote(value)}>
                            <h2 className={inter.className}>{value}</h2>
                        </div>
                    })}
                </>
            }
        </div>
    </>
}
