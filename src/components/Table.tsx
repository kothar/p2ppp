'use client';

import {
    addPlayer,
    addVote,
    mergeState,
    newState, nextRound,
    playerVote,
    State,
    StateUpdate,
    updateRevealVotes, updateVoteScheme, voteSchemes
} from '@/state/state';
import { useEffect, useState } from 'react';
import { getPlayerCookie, newPlayer, Player, setPlayerCookie } from '@/state/player';
import styles from './Table.module.css'
import { Inter } from 'next/font/google';
import isNode from 'detect-node';
import assert from 'assert';

const inter = Inter({ subsets: ['latin'] });

interface IPeerGroup {
    setPlayers(players: string[]): void;

    setState(state: State): void;

    onUpdate: ((update: StateUpdate) => void) | undefined;

    sendMessage(update: StateUpdate): void;

    close(): void;

    isConnecting(peer: string): boolean

    isConnected(peer: string): boolean
}

export default function Table(props: { player?: Player, players: Record<string, Player>, table: string }) {
    const { players, table } = props;

    // Player
    const [player, setPlayer] = useState(props.player);
    if (!player) {
        updatePlayer(getPlayerCookie() || newPlayer('Player')).catch(console.error);
    }

    // State
    const [state, setState] = useState(newState(table, players));
    const [peerGroup, setPeerGroup] = useState<IPeerGroup | undefined>();
    peerGroup?.setPlayers(Object.keys(state.players));
    peerGroup?.setState(state);
    peerGroup && (peerGroup.onUpdate = applyStateUpdate);

    // UI
    const [showSchemes, setShowScemes] = useState(false);

    function applyStateUpdate(update: StateUpdate) {
        setState(mergeState(state, update));
    }

    function propagateStateUpdate(update: StateUpdate) {
        peerGroup?.sendMessage(update);
        applyStateUpdate(update);
    }

    useEffect(() => {
        let peerGroup: IPeerGroup | undefined;
        if (!isNode && player) {
            (async () => {
                const { PeerGroup } = await import('@/peer-group/PeerGroup');
                peerGroup = new PeerGroup(table, player.uuid);
                setPeerGroup(peerGroup);
            })();
        }
        return () => peerGroup?.close();
    }, [table, player?.uuid]);

    async function updatePlayer(player: Player) {
        setPlayerCookie(player);
        setPlayer(player);

        // Send update to server
        const response: { result: 'success' | 'failure' } = await fetch(`/api/table/${table}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player),
        }).then(r => r.json());
        console.log(response);
        assert.equal(response.result, 'success');

        propagateStateUpdate(addPlayer(state, player));
    }

    function editPlayerName() {
        if (!player) {
            return;
        }

        const newName = prompt('Enter new player name', player.name);
        if (newName) {
            updatePlayer({
                ...player,
                name: newName
            }).catch(console.error);
        }
    }

    function updateVote(value: number | '?') {
        if (!player) {
            return;
        }

        propagateStateUpdate(addVote(state, player, value));
    }

    function editVoteScheme(voteScheme: keyof typeof voteSchemes) {
        propagateStateUpdate(updateVoteScheme(state, voteScheme));
    }

    function revealVotes(reveal = true) {
        propagateStateUpdate(updateRevealVotes(state, reveal));
    }

    function resetVotes() {
        propagateStateUpdate(nextRound(state));
    }

    function computePeerStyle(peer: Player) {
        return [
            [styles.card],
            peerGroup?.isConnecting(peer.uuid) ? [styles.connecting] : [],
            peer.uuid === player?.uuid ? [styles.self] : []
        ].flat().join(' ');
    }

    function filteredPlayers() {
        return Object.values(state.players)
            .filter(peer =>
                peer.uuid === player?.uuid ||
                peerGroup?.isConnecting(peer.uuid) ||
                peerGroup?.isConnected(peer.uuid)
            );
    }

    return <>
        <div className={styles.description}>
            <a href="/">P2PPP - Peer to Peer Planning Poker</a>
            <div>
                <span className={styles.card}>{player?.name}</span>
                <button className={styles.card} onClick={editPlayerName}>Change name</button>
            </div>
        </div>

        <div className={styles.grid}>
            {filteredPlayers().map(peer => {
                const vote = playerVote(state, peer);
                return <div className={computePeerStyle(peer)} key={peer.uuid}
                            onClick={() => {
                                if (peer.uuid === player?.uuid) editPlayerName()
                            }}>
                    <p className={inter.className}>{peer.name}</p>
                    <h2 className={inter.className}>{state.revealVotes ? vote?.value ?? '?' : (vote ? '✔' : '⋯')}</h2>
                </div>
            })}
            {state.revealVotes ?
                <button className={styles.card} onClick={() => revealVotes(false)}>
                    <h2 className={inter.className}>Hide</h2>
                </button> :
                <button className={styles.card} onClick={() => revealVotes()}>
                    <h2 className={inter.className}>Reveal</h2>
                </button>
            }
        </div>

        {state.revealVotes ?
            <div className={styles.grid}>
                <button className={styles.card} onClick={() => resetVotes()}>
                    <p className={inter.className}>Voting complete</p>
                    <h2 className={inter.className}>Reset</h2>
                </button>
            </div> :

            <>
                <div className={styles.votegrid}>
                    <button className={styles.card} onClick={() => setShowScemes(!showSchemes)}>
                        <p className={inter.className}>Scheme</p>
                        <h2 className={inter.className}>{state.voteScheme}</h2>
                    </button>
                    {voteSchemes[state.voteScheme].map(value => {
                        return <button key={value} className={styles.card}
                                       onClick={() => updateVote(value)}>
                            <p className={inter.className}>&nbsp;</p>
                            <h2 className={inter.className}>{value}</h2>
                        </button>
                    })}

                    <div className={`${styles.grid} ${styles.schemes}`}
                         style={{ display: showSchemes ? 'inherit' : 'none' }}>
                        {Object.keys(voteSchemes).map(voteScheme =>
                            <button className={styles.card} key={voteScheme} onClick={() => {
                                editVoteScheme(voteScheme);
                                setShowScemes(false);
                            }}>
                                <p className={inter.className}>Scheme</p>
                                <h2 className={inter.className}>{voteScheme}</h2>
                            </button>
                        )}
                    </div>
                </div>
            </>
        }
    </>
}
