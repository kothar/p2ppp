'use client';
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { useState } from 'react';
import { newState } from '@/state/state';
import { newPlayer } from '@/state/player';

const inter = Inter({ subsets: ['latin'] })

export default function Home({ params }: { params: { table: string } }) {
    const { table } = params;
    const [state, setState] = useState(newState(table));
    const [player, setPlayer] = useState(newPlayer('Bob'));

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <a href="/">Yet Another Planning Poker</a>
                <div>
                    {state.tableUuid}: {player.name}
                </div>
            </div>

            <div className={styles.center}>
                <div className={styles.card}>
                    <p className={inter.className}>Alice</p>
                    <h2 className={inter.className}>1</h2>
                </div>
                <div className={styles.card}>
                    <p className={inter.className}>Bob</p>
                    <h2 className={inter.className}>2</h2>
                </div>
                <div className={styles.card}>
                    <p className={inter.className}>Carol</p>
                    <h2 className={inter.className}>3</h2>
                </div>
                <div className={styles.card}>
                    <p className={inter.className}>David</p>
                    <h2 className={inter.className}>1</h2>
                </div>
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
