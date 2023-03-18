'use client';
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { useSearchParams } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

export default function Home({ params }: { params: { table: string } }) {
    const { table } = params;

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <p>Yet Another Planning Poker</p>
                <div>
                    {table}: Name
                </div>
            </div>

            <div className={styles.center}>
                {/*<Image*/}
                {/*  className={styles.logo}*/}
                {/*  src="/next.svg"*/}
                {/*  alt="Next.js Logo"*/}
                {/*  width={180}*/}
                {/*  height={37}*/}
                {/*  priority*/}
                {/*/>*/}
                {/*<div className={styles.thirteen}>*/}
                {/*  <Image src="/thirteen.svg" alt="13" width={40} height={31} priority />*/}
                {/*</div>*/}
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
                {/*<a*/}
                {/*  href="https://beta.nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"*/}
                {/*  className={styles.card}*/}
                {/*  target="_blank"*/}
                {/*  rel="noopener noreferrer"*/}
                {/*>*/}
                {/*  <h2 className={inter.className}>*/}
                {/*    Docs <span>-&gt;</span>*/}
                {/*  </h2>*/}
                {/*  <p className={inter.className}>*/}
                {/*    Find in-depth information about Next.js features and API.*/}
                {/*  </p>*/}
                {/*</a>*/}

                {/*<a*/}
                {/*  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"*/}
                {/*  className={styles.card}*/}
                {/*  target="_blank"*/}
                {/*  rel="noopener noreferrer"*/}
                {/*>*/}
                {/*  <h2 className={inter.className}>*/}
                {/*    Templates <span>-&gt;</span>*/}
                {/*  </h2>*/}
                {/*  <p className={inter.className}>Explore the Next.js 13 playground.</p>*/}
                {/*</a>*/}

                {/*<a*/}
                {/*  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"*/}
                {/*  className={styles.card}*/}
                {/*  target="_blank"*/}
                {/*  rel="noopener noreferrer"*/}
                {/*>*/}
                {/*  <h2 className={inter.className}>*/}
                {/*    Deploy <span>-&gt;</span>*/}
                {/*  </h2>*/}
                {/*  <p className={inter.className}>*/}
                {/*    Instantly deploy your Next.js site to a shareable URL with Vercel.*/}
                {/*  </p>*/}
                {/*</a>*/}
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
