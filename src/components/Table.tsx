'use client';

import { addVote, mergeState, newState, playerVote, State, StateUpdate } from '@/state/state';
import { useEffect, useState } from 'react';
import { Player, setPlayerCookie } from '@/state/player';
import styles from './Table.module.css'
import { Inter } from 'next/font/google';
import isNode from 'detect-node';

const inter = Inter({ subsets: ['latin'] })

const voteSchemes: Record<string, Array<number | '?'>> = {
    fibonacci: [1, 2, 3, 5, 8, 13, '?']
};

interface IPeerGroup {
    setPlayers(players: string[]): void;

    setState(state: State): void;

    onUpdate: ((update: StateUpdate) => void) | undefined;

    sendMessage(update: StateUpdate): void;

    close(): void;
}

export default function Table(props: { player: Player, players: Record<string, Player>, table: string }) {
    const { players, table } = props;

    // Player
    const [player, setPlayer] = useState(props.player);
    setPlayerCookie(player);

    // State
    const [state, setState] = useState(newState(table, players));
    const [peerGroup, setPeerGroup] = useState<IPeerGroup | undefined>();
    peerGroup?.setPlayers(Object.keys(state.players));
    peerGroup?.setState(state);
    peerGroup && (peerGroup.onUpdate = applyStateUpdate);

    function applyStateUpdate(update: StateUpdate) {
        setState(mergeState(state, update));
    }

    function propagateStateUpdate(update: StateUpdate) {
        peerGroup?.sendMessage(update);
        applyStateUpdate(update);
    }

    useEffect(() => {
        let peerGroup: IPeerGroup | undefined;
        if (!isNode) {
            (async () => {
                const { PeerGroup } = await import('@/peer-group/PeerGroup');
                peerGroup = new PeerGroup(table, player.uuid);
                setPeerGroup(peerGroup);
            })();
        }
        return () => peerGroup?.close();
    }, [table, player]);

    async function updatePlayer(player: Player) {
        setPlayerCookie(player);
        setPlayer(player);

        // Send update to server
        const players: Player[] = await fetch(`/api/table/${table}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player),
        }).then(r => r.json());

        const playerMap = Object.fromEntries(players.map(player => [player.uuid, player]));
        propagateStateUpdate({ tableUuid: table, players: playerMap });
    }

    function editPlayerName() {
        const newName = prompt('Enter new player name', player?.name ?? 'Player');
        if (newName) {
            updatePlayer({
                ...player,
                name: newName
            }).catch(console.error);
        }
    }

    function updateVote(value: number | '?') {
        propagateStateUpdate(addVote(state, player, value));
    }

    function revealVotes(reveal = true) {
        propagateStateUpdate({ tableUuid: state.tableUuid, revealVotes: reveal });
    }

    function resetVotes() {
        propagateStateUpdate({ tableUuid: state.tableUuid, resetVotes: true });
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
