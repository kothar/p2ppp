import { Inter } from 'next/font/google'
import styles from './page.module.css'
import NewTable from '@/components/NewTable';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <a href="/">P2PPP - Peer to Peer Planning Poker</a>
                <div>
                    {/*Name*/}
                </div>
            </div>

            <div className={styles.center}>
                <div className={inter.className}>
                    <NewTable />
                </div>
            </div>

            <div className={styles.grid}>
            </div>
        </main>
    )
}
