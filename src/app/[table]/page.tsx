'use client';
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import { addPlayer, addVote, mergeState, newState, playerVote } from '@/state/state';
import { usePlayer } from '@/state/player';

const inter = Inter({ subsets: ['latin'] })

const voteSchemes: Record<string, Array<number | '?'>> = {
    fibonacci: [1, 2, 3, 5, 8, 13, '?']
};

export default function Home({ params }: { params: { table: string } }) {
    const { table } = params;
    const [state, setState] = useState(newState(table));
    const [player, setPlayer] = usePlayer();

    useEffect(() => {
        const update = addPlayer(state, player);
        // TODO send update to group
        const nextState = mergeState(state, update);
        setState(nextState);
    }, [player]);

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

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <a href="/">Yet Another Planning Poker</a>
                <div>
                    {state.tableUuid}: {player.name}
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
        </main>
    )
}
