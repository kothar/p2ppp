'use client';
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import { addPlayer, mergeState, newState, playerVote } from '@/state/state';
import { newPlayer } from '@/state/player';

const inter = Inter({ subsets: ['latin'] })

export default function Home({ params }: { params: { table: string } }) {
    const { table } = params;
    const [state, setState] = useState(newState(table));
    const [player, setPlayer] = useState(newPlayer('Bob'));

    useEffect(() => {
        const update = addPlayer(state, player);
        // TODO send update to group
        const nextState = mergeState(state, update);
        setState(nextState);
    }, [player]);

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
                        <p className={inter.className}>{player.name} {vote ? '✔' : '⋯'}</p>
                        <h2 className={inter.className}>{state.revealVotes ? vote?.value ?? '?' : '-'}</h2>
                    </div>
                })}
            </div>

            <div className={styles.grid}>
                <div className={styles.card}><h2 className={inter.className}>1</h2></div>
                <div className={styles.card}><h2 className={inter.className}>2</h2></div>
                <div className={styles.card}><h2 className={inter.className}>3</h2></div>
                <div className={styles.card}><h2 className={inter.className}>5</h2></div>
                <div className={styles.card}><h2 className={inter.className}>8</h2></div>
                <div className={styles.card}><h2 className={inter.className}>13</h2></div>
                <div className={styles.card}><h2 className={inter.className}>?</h2></div>
            </div>
        </main>
    )
}
